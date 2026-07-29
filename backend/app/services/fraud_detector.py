import json
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import NotFoundException
from app.models.fraud_case import FraudCase, FraudCaseStatus, FraudType
from app.models.fraud_alert import FraudAlert, FraudAlertSeverity, FraudAlertStatus
from app.models.risk_score import RiskScore
from app.models.transaction import Transaction, TransactionStatus
from app.repositories.fraud_repo import FraudCaseRepository
from app.repositories.transaction_repo import TransactionRepository
from app.services.ml.ml_models import MLModelRegistry
from app.services.ml.feature_engineering import FeatureEngine
from app.services.ml.impossible_travel import ImpossibleTravelDetector
from app.services.ml.velocity_engine import VelocityEngine
from app.services.ml.behavioral_analytics import BehavioralAnalyzer
from app.services.ml.graph_analyzer import GraphAnalyzer
from app.services.ml.explainer import ModelExplainer

logger = structlog.get_logger("services.fraud_detector")


class FraudDetectionEngine:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.settings = get_settings()
        self.txn_repo = TransactionRepository(db)
        self.fraud_repo = FraudCaseRepository(db)
        self.feature_engine = FeatureEngine(db)
        self.ml_registry = MLModelRegistry.get_instance()
        self.travel_detector = ImpossibleTravelDetector(db)
        self.velocity_engine = VelocityEngine(db)
        self.behavioral_analyzer = BehavioralAnalyzer(db)
        self.graph_analyzer = GraphAnalyzer(db)
        self.explainer = ModelExplainer()

    async def scan_transaction(self, transaction_id: int) -> dict[str, Any]:
        txn = await self.txn_repo.get_by_id(transaction_id)
        if not txn:
            raise NotFoundException("Transaction", transaction_id)

        existing = await self.fraud_repo.get_by_transaction(transaction_id)
        if existing and existing.status not in (FraudCaseStatus.OPEN,):
            return {
                "is_suspicious": True,
                "risk_score": existing.risk_score,
                "fraud_type": existing.fraud_type.value,
                "factors": json.loads(existing.evidence_json or "{}").get("factors", []),
                "already_reported": True,
                "case_id": existing.id,
            }

        rule_risk, factors, fraud_type = 0.0, [], None
        rule_risk, factors, fraud_type = self._check_large_amount(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = await self._check_velocity(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = await self._check_refund_abuse(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = await self._check_duplicate_payment(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = await self._check_repeated_failures(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = self._check_round_amount(txn, rule_risk, factors, fraud_type)
        rule_risk, factors, fraud_type = self._check_unusual_time(txn, rule_risk, factors, fraud_type)

        rule_risk = min(rule_risk, 1.0)

        features = await self.feature_engine.extract_features(txn)
        ml_result = self.ml_registry.predict(features) if self.ml_registry.initialized or True else {"scores": {}, "ensemble_score": 0.0}
        if not self.ml_registry.initialized:
            try:
                self.ml_registry.initialize()
                ml_result = self.ml_registry.predict(features)
            except Exception:
                ml_result = {"scores": {}, "ensemble_score": 0.0}

        ensemble_score = ml_result.get("ensemble_score", 0.0)

        travel_check = await self.travel_detector.check_transaction(txn)
        travel_risk = travel_check.get("risk_score", 0.0) if travel_check.get("is_impossible_travel") else 0.0

        velocity_check = await self.velocity_engine.check_transaction(txn)
        velocity_risk = velocity_check.get("max_velocity_risk", 0.0)

        behavioral_check = await self.behavioral_analyzer.analyze(txn)
        behavior_risk = behavioral_check.get("behavioral_risk", 0.0)

        graph_check = await self.graph_analyzer.analyze_transaction(txn)
        graph_risk = graph_check.get("graph_risk", 0.0)

        combined_risk = max(
            rule_risk * 0.35 + ensemble_score * 0.35,
            travel_risk,
            velocity_risk,
            behavior_risk,
            graph_risk,
        )
        combined_risk = min(combined_risk, 1.0)

        if ensemble_score > rule_risk and ensemble_score >= 0.5:
            dominant_type = FraudType.ML_HIGH_RISK
        elif travel_risk > 0.5:
            dominant_type = FraudType.IMPOSSIBLE_TRAVEL
        elif velocity_risk > 0.5:
            dominant_type = FraudType.VELOCITY
        elif behavior_risk > 0.5:
            dominant_type = FraudType.BEHAVIORAL_ANOMALY
        elif graph_risk > 0.5:
            dominant_type = FraudType.GRAPH_ANOMALY
        else:
            dominant_type = fraud_type or FraudType.RULE_TRIGGERED

        explanation = None
        if ensemble_score > 0:
            explanation = self.explainer.explain(features, ml_result.get("scores", {}), ensemble_score)

        shap_json = None
        model_contrib_json = None
        if explanation:
            shap_json = json.dumps({
                "top_factors": explanation.get("top_factors", []),
                "summary": explanation.get("explanation_summary", ""),
            })
            model_contrib_json = json.dumps(explanation.get("model_contributions", []))

        all_factors = list(factors)

        if travel_check.get("violations"):
            all_factors.append(f"Impossible travel detected: {len(travel_check['violations'])} violation(s)")
        if velocity_check.get("velocity_alerts"):
            all_factors.append(f"Velocity alerts: {len(velocity_check['velocity_alerts'])} window(s)")
        if behavioral_check.get("anomalies"):
            all_factors.append(f"Behavioral anomalies: {len(behavioral_check['anomalies'])}")
        if graph_check.get("indicators"):
            all_factors.append(f"Graph indicators: {len(graph_check['indicators'])}")
        if ml_result.get("scores"):
            scores_str = ", ".join(f"{k}={v:.3f}" for k, v in ml_result["scores"].items())
            all_factors.append(f"ML scores: {scores_str} (ensemble={ensemble_score:.3f})")

        is_suspicious = combined_risk >= 0.4
        case_id = None
        alert_id = None

        if is_suspicious:
            fraud_case = FraudCase(
                transaction_id=txn.id,
                fraud_type=dominant_type,
                risk_score=round(combined_risk, 4),
                ml_risk_score=round(ensemble_score, 4) if ensemble_score > 0 else None,
                rule_risk_score=round(rule_risk, 4) if rule_risk > 0 else None,
                model_contributions=model_contrib_json,
                shap_explanation=shap_json,
                evidence_json=json.dumps({
                    "factors": all_factors,
                    "transaction_ref": txn.transaction_ref,
                    "amount": txn.amount,
                    "features": features,
                    "ml_scores": ml_result.get("scores", {}),
                    "ensemble_score": ensemble_score,
                    "travel_check": travel_check,
                    "velocity_check": velocity_check,
                    "behavioral_check": behavioral_check,
                    "graph_check": graph_check,
                }),
                status=FraudCaseStatus.OPEN,
            )
            self.db.add(fraud_case)
            await self.db.commit()
            await self.db.refresh(fraud_case)
            case_id = fraud_case.id

            risk_score_record = RiskScore(
                transaction_id=txn.id,
                entity_type="transaction",
                entity_id=txn.id,
                score=round(combined_risk, 4),
                model_name="ensemble",
                score_type="ensemble",
                features_json=json.dumps(features),
                shap_values_json=shap_json,
            )
            self.db.add(risk_score_record)

            severity = FraudAlertSeverity.CRITICAL if combined_risk >= 0.8 else FraudAlertSeverity.HIGH if combined_risk >= 0.6 else FraudAlertSeverity.MEDIUM
            alert = FraudAlert(
                transaction_id=txn.id,
                case_id=fraud_case.id,
                alert_type=dominant_type.value,
                severity=severity,
                status=FraudAlertStatus.NEW,
                title=f"Fraud Alert: {dominant_type.value.replace('_', ' ').title()}",
                description=f"Risk score: {combined_risk:.2f} | {len(all_factors)} factor(s) detected",
                metadata_json=json.dumps({"factors": all_factors[:5]}),
            )
            self.db.add(alert)
            await self.db.commit()
            await self.db.refresh(alert)
            alert_id = alert.id

            logger.warning(
                "fraud_detected",
                transaction_id=txn.id,
                risk_score=combined_risk,
                rule_risk=rule_risk,
                ml_risk=ensemble_score,
                fraud_type=dominant_type.value,
                case_id=case_id,
                alert_id=alert_id,
            )

        return {
            "is_suspicious": is_suspicious,
            "risk_score": round(combined_risk, 4),
            "rule_risk_score": round(rule_risk, 4),
            "ml_risk_score": round(ensemble_score, 4),
            "fraud_type": dominant_type.value,
            "factors": all_factors,
            "case_id": case_id,
            "alert_id": alert_id,
            "ml_explanation": explanation,
            "travel_check": travel_check if travel_check.get("is_impossible_travel") else None,
            "velocity_check": velocity_check if velocity_check.get("has_velocity_issue") else None,
            "behavioral_check": behavioral_check if behavioral_check.get("anomalies") else None,
            "graph_check": graph_check if graph_check.get("indicators") else None,
        }

    def _check_large_amount(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.amount > self.settings.FRAUD_LARGE_AMOUNT_THRESHOLD:
            risk += 0.4
            factors.append(f"Large transaction amount: {txn.amount} (threshold: {self.settings.FRAUD_LARGE_AMOUNT_THRESHOLD})")
            ftype = FraudType.LARGE_TRANSACTION
        return risk, factors, ftype

    async def _check_velocity(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        count = await self.txn_repo.get_velocity_count(txn.merchant_id, self.settings.FRAUD_VELOCITY_WINDOW_MINUTES)
        if count > self.settings.FRAUD_VELOCITY_THRESHOLD:
            risk += 0.3
            factors.append(f"High velocity: {count} transactions in {self.settings.FRAUD_VELOCITY_WINDOW_MINUTES}min (threshold: {self.settings.FRAUD_VELOCITY_THRESHOLD})")
            if not ftype:
                ftype = FraudType.VELOCITY
        return risk, factors, ftype

    async def _check_refund_abuse(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.customer_id:
            refund_count = await self.txn_repo.get_refund_count(txn.customer_id)
            if refund_count > self.settings.FRAUD_MAX_REFUNDS_PER_CUSTOMER:
                risk += 0.25
                factors.append(f"Refund abuse: {refund_count} refunds for customer (threshold: {self.settings.FRAUD_MAX_REFUNDS_PER_CUSTOMER})")
                if not ftype:
                    ftype = FraudType.REFUND_ABUSE
        return risk, factors, ftype

    async def _check_duplicate_payment(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        duplicates = await self.txn_repo.find_duplicates(txn.amount, txn.currency, txn.gateway_id, self.settings.FRAUD_DUPLICATE_WINDOW_SECONDS)
        if len(duplicates) > 1:
            risk += 0.35
            factors.append(f"Potential duplicate: {len(duplicates)} transactions with same amount/gateway within {self.settings.FRAUD_DUPLICATE_WINDOW_SECONDS}s")
            if not ftype:
                ftype = FraudType.DUPLICATE
        return risk, factors, ftype

    async def _check_repeated_failures(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.status == TransactionStatus.FAILED:
            failure_count = await self.txn_repo.count([
                Transaction.merchant_id == txn.merchant_id,
                Transaction.status == TransactionStatus.FAILED,
            ])
            if failure_count > 10:
                risk += 0.2
                factors.append(f"Repeated failures: {failure_count} failed transactions for this merchant")
                if not ftype:
                    ftype = FraudType.RULE_TRIGGERED
        return risk, factors, ftype

    def _check_round_amount(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.amount > 1000 and txn.amount == int(txn.amount):
            risk += 0.05
            factors.append(f"Round amount: {txn.amount}")
        return risk, factors, ftype

    def _check_unusual_time(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.created_at:
            hour = txn.created_at.hour
            if hour < 2 or hour >= 5:
                risk += 0.05
                factors.append(f"Unusual transaction time: {hour:02d}:00 UTC")
        return risk, factors, ftype


async def scan_transaction(db: AsyncSession, transaction_id: int) -> dict:
    engine = FraudDetectionEngine(db)
    return await engine.scan_transaction(transaction_id)


async def list_fraud_cases(db: AsyncSession, page: int = 1, size: int = 20, status: str | None = None, fraud_type: str | None = None, min_score: float | None = None) -> tuple[list[FraudCase], int]:
    repo = FraudCaseRepository(db)
    return await repo.list_filtered(offset=(page - 1) * size, limit=size, status=status, fraud_type=fraud_type, min_score=min_score)


async def get_fraud_case(db: AsyncSession, case_id: int) -> FraudCase:
    repo = FraudCaseRepository(db)
    case = await repo.get_by_id(case_id)
    if not case:
        raise NotFoundException("FraudCase", case_id)
    return case


async def resolve_fraud_case(db: AsyncSession, case_id: int, status: str, notes: str | None = None, resolution: str | None = None) -> FraudCase:
    case = await get_fraud_case(db, case_id)
    case.status = status
    if notes:
        case.review_notes = notes
    if resolution:
        case.resolution = resolution
    await db.commit()
    await db.refresh(case)
    return case


async def assign_fraud_case(db: AsyncSession, case_id: int, assigned_to: int) -> FraudCase:
    case = await get_fraud_case(db, case_id)
    case.assigned_to = assigned_to
    await db.commit()
    await db.refresh(case)
    return case


async def escalate_fraud_case(db: AsyncSession, case_id: int, escalated_to: int) -> FraudCase:
    case = await get_fraud_case(db, case_id)
    case.escalated = True
    case.escalated_to = escalated_to
    await db.commit()
    await db.refresh(case)
    return case


async def get_fraud_dashboard(db: AsyncSession) -> dict:
    repo = FraudCaseRepository(db)
    return await repo.get_dashboard()


async def get_ml_dashboard(db: AsyncSession) -> dict:
    from app.models.transaction import Transaction
    from app.models.risk_score import RiskScore

    ml_cases = await db.execute(
        select(FraudCase).where(
            FraudCase.ml_risk_score.isnot(None)
        ).order_by(FraudCase.created_at.desc()).limit(100)
    )
    ml_cases_list = list(ml_cases.scalars().all())

    avg_ml_score = sum(c.ml_risk_score or 0 for c in ml_cases_list) / len(ml_cases_list) if ml_cases_list else 0.0
    avg_rule_score = sum(c.rule_risk_score or 0 for c in ml_cases_list) / len(ml_cases_list) if ml_cases_list else 0.0

    model_counts = {"isolation_forest": 0, "random_forest": 0, "xgboost": 0, "lightgbm": 0}
    for case in ml_cases_list:
        if case.model_contributions:
            try:
                contribs = json.loads(case.model_contributions)
                for c in contribs:
                    if c["model"] in model_counts:
                        model_counts[c["model"]] += 1
            except (json.JSONDecodeError, KeyError, TypeError):
                pass

    feature_importance = MLModelRegistry.get_instance().get_feature_importance() if MLModelRegistry.get_instance().initialized else {}

    fraud_rings = []
    try:
        analyzer = __import__("app.services.ml.graph_analyzer", fromlist=["GraphAnalyzer"])
        graph = analyzer.GraphAnalyzer(db)
        fraud_rings = await graph.find_fraud_rings()
    except Exception:
        pass

    return {
        "avg_ml_risk_score": round(avg_ml_score, 4),
        "avg_rule_risk_score": round(avg_rule_score, 4),
        "ml_case_count": len(ml_cases_list),
        "model_usage": model_counts,
        "feature_importance": feature_importance,
        "fraud_rings": fraud_rings,
        "ml_enabled": MLModelRegistry.get_instance().initialized,
    }


async def get_alerts(db: AsyncSession, page: int = 1, size: int = 20, severity: str | None = None, status: str | None = None) -> tuple[list[FraudAlert], int]:
    from app.models.fraud_alert import FraudAlert, FraudAlertSeverity, FraudAlertStatus

    query = select(FraudAlert)
    count_query = select(func.count(FraudAlert.id))
    filters = []
    if severity:
        filters.append(FraudAlert.severity == severity)
    if status:
        filters.append(FraudAlert.status == status)
    for f in filters:
        query = query.where(f)
        count_query = count_query.where(f)
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(FraudAlert.created_at.desc()).offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def acknowledge_alert(db: AsyncSession, alert_id: int) -> FraudAlert:
    from app.models.fraud_alert import FraudAlert, FraudAlertStatus
    alert = await db.get(FraudAlert, alert_id)
    if not alert:
        raise NotFoundException("FraudAlert", alert_id)
    alert.status = FraudAlertStatus.ACKNOWLEDGED
    await db.commit()
    await db.refresh(alert)
    return alert
