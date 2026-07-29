import json
from typing import Any

import numpy as np
import structlog

from app.services.ml.feature_engineering import FEATURE_NAMES

logger = structlog.get_logger("services.ml.explainer")


class ModelExplainer:
    def __init__(self):
        self.shap_explainer = None

    def explain(
        self,
        features: dict[str, float],
        model_scores: dict[str, float],
        ensemble_score: float,
    ) -> dict[str, Any]:
        explanations = []
        top_factors = []

        if model_scores:
            sorted_models = sorted(model_scores.items(), key=lambda x: x[1], reverse=True)
            for model_name, score in sorted_models:
                explanations.append({
                    "model": model_name,
                    "score": round(score, 4),
                    "weight": score / ensemble_score if ensemble_score > 0 else 0,
                })

        feature_importances = self._compute_local_importance(features)
        sorted_features = sorted(feature_importances.items(), key=lambda x: abs(x[1]), reverse=True)

        for feat_name, contribution in sorted_features[:10]:
            top_factors.append({
                "feature": feat_name,
                "value": features.get(feat_name, 0.0),
                "contribution": round(float(contribution), 4),
                "direction": "increases_risk" if contribution > 0 else "decreases_risk",
            })

        risk_factors = [f for f in top_factors if f["contribution"] > 0]
        protective_factors = [f for f in top_factors if f["contribution"] <= 0]

        risk_level = "low"
        if ensemble_score >= 0.8:
            risk_level = "critical"
        elif ensemble_score >= 0.6:
            risk_level = "high"
        elif ensemble_score >= 0.4:
            risk_level = "medium"

        return {
            "ensemble_score": round(ensemble_score, 4),
            "risk_level": risk_level,
            "model_contributions": explanations,
            "top_factors": top_factors[:10],
            "risk_factors": risk_factors[:5],
            "protective_factors": protective_factors[:3],
            "explanation_summary": self._generate_summary(ensemble_score, risk_factors, protective_factors),
        }

    def _compute_local_importance(self, features: dict[str, float]) -> dict[str, float]:
        importances = {}
        for name in FEATURE_NAMES:
            value = features.get(name, 0.0)
            if name == "amount":
                importances[name] = value / 100000.0 if value > 0 else 0.0
            elif name == "amount_log":
                importances[name] = value / 10.0
            elif name == "amount_roundness":
                importances[name] = value * 0.1
            elif name == "hour":
                importances[name] = (1.0 if value < 6 or value >= 23 else -0.1)
            elif name == "txn_count_5m":
                importances[name] = value * 0.08 if value > 3 else 0.0
            elif name == "txn_count_15m":
                importances[name] = value * 0.05 if value > 10 else 0.0
            elif name == "txn_count_1h":
                importances[name] = value * 0.02 if value > 30 else 0.0
            elif name == "txn_count_24h":
                importances[name] = value * 0.005 if value > 100 else 0.0
            elif name == "amount_zscore":
                importances[name] = abs(value) * 0.05 if abs(value) > 2 else 0.0
            elif name == "failure_rate_24h":
                importances[name] = value * 0.3
            elif name == "distance_km_prev":
                importances[name] = value / 1000.0
            elif name == "minutes_since_last_txn":
                importances[name] = -0.1 if value < 1 else 0.0
            else:
                importances[name] = 0.0
        return importances

    def _generate_summary(self, score: float, risk_factors: list, protective_factors: list) -> str:
        parts = []
        if risk_factors:
            top = risk_factors[0]
            parts.append(f"Primary risk driver: {top['feature']} ({top['value']})")
        if score >= 0.7:
            parts.append("Multiple high-risk indicators detected")
        elif score >= 0.4:
            parts.append("Moderate risk pattern identified")
        else:
            parts.append("Transaction appears normal")
        return ". ".join(parts)
