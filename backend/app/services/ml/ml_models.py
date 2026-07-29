import json
import math
from typing import Any

import numpy as np
import structlog
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler

logger = structlog.get_logger("services.ml.ml_models")

FEATURE_NAMES = [
    "amount", "amount_log", "amount_roundness", "hour", "is_weekend", "is_night",
    "txn_count_5m", "txn_count_15m", "txn_count_1h", "txn_count_24h",
    "avg_amount_24h", "amount_std_24h", "amount_zscore", "failure_rate_24h",
    "same_country", "distance_km_prev", "minutes_since_last_txn",
]


class MLModelRegistry:
    _instance: "MLModelRegistry | None" = None

    def __init__(self):
        self.initialized = False
        self.isolation_forest: IsolationForest | None = None
        self.random_forest: RandomForestClassifier | None = None
        self.xgboost_model: Any = None
        self.lightgbm_model: Any = None
        self.scaler: StandardScaler | None = None
        self.lstm_model: Any = None

    @classmethod
    def get_instance(cls) -> "MLModelRegistry":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def initialize(self):
        if self.initialized:
            return
        try:
            rng = np.random.RandomState(42)
            n_samples = 1000

            normal = rng.randn(n_samples, len(FEATURE_NAMES)) * 0.5
            anomalies = rng.uniform(low=-3, high=5, size=(int(n_samples * 0.1), len(FEATURE_NAMES)))
            X_train = np.vstack([normal, anomalies])

            y_train = np.array([0] * n_samples + [1] * int(n_samples * 0.1))

            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X_train)

            self.isolation_forest = IsolationForest(
                n_estimators=100,
                contamination=0.05,
                random_state=42,
                n_jobs=1,
            )
            self.isolation_forest.fit(X_scaled)

            self.random_forest = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=1,
            )
            self.random_forest.fit(X_scaled, y_train)

            try:
                import xgboost as xgb
                dtrain = xgb.DMatrix(X_scaled, label=y_train)
                params = {
                    "max_depth": 6,
                    "eta": 0.1,
                    "objective": "binary:logistic",
                    "eval_metric": "auc",
                    "seed": 42,
                    "nthread": 1,
                }
                self.xgboost_model = xgb.train(params, dtrain, num_boost_round=50)
            except Exception as e:
                logger.warning("xgboost_init_failed", error=str(e))

            try:
                import lightgbm as lgb
                train_data = lgb.Dataset(X_scaled, label=y_train)
                params = {
                    "objective": "binary",
                    "metric": "auc",
                    "max_depth": 6,
                    "learning_rate": 0.1,
                    "num_leaves": 31,
                    "verbose": -1,
                    "num_threads": 1,
                }
                self.lightgbm_model = lgb.train(params, train_data, num_boost_round=50)
            except Exception as e:
                logger.warning("lightgbm_init_failed", error=str(e))

            self.initialized = True
            logger.info("ml_models_initialized", models={
                "isolation_forest": True,
                "random_forest": True,
                "xgboost": self.xgboost_model is not None,
                "lightgbm": self.lightgbm_model is not None,
            })
        except Exception as e:
            logger.error("ml_init_failed", error=str(e))

    def predict(self, features: dict[str, float]) -> dict[str, Any]:
        if not self.initialized:
            self.initialize()
        if not self.initialized or self.scaler is None:
            return {"error": "models_not_initialized", "scores": {}, "ensemble_score": 0.0}

        feature_vector = np.array([[features.get(f, 0.0) for f in FEATURE_NAMES]], dtype=np.float64)
        feature_vector = np.nan_to_num(feature_vector, nan=0.0, posinf=1.0, neginf=-1.0)

        try:
            X = self.scaler.transform(feature_vector)
        except Exception:
            X = feature_vector

        scores: dict[str, float] = {}

        if self.isolation_forest is not None:
            anomaly_score = -self.isolation_forest.score_samples(X)[0]
            if math.isfinite(anomaly_score):
                scores["isolation_forest"] = float(np.clip(anomaly_score / 2.0, 0.0, 1.0))

        if self.random_forest is not None:
            prob = self.random_forest.predict_proba(X)[0]
            rf_score = float(prob[1]) if len(prob) > 1 else 0.0
            if math.isfinite(rf_score):
                scores["random_forest"] = rf_score

        if self.xgboost_model is not None:
            try:
                import xgboost as xgb
                dmat = xgb.DMatrix(X)
                xgb_prob = self.xgboost_model.predict(dmat)[0]
                if math.isfinite(float(xgb_prob)):
                    scores["xgboost"] = float(xgb_prob)
            except Exception:
                pass

        if self.lightgbm_model is not None:
            try:
                lgb_prob = self.lightgbm_model.predict(X)[0]
                if math.isfinite(float(lgb_prob)):
                    scores["lightgbm"] = float(lgb_prob)
            except Exception:
                pass

        weights = {"isolation_forest": 0.15, "random_forest": 0.25, "xgboost": 0.35, "lightgbm": 0.25}
        weighted_sum = 0.0
        total_weight = 0.0
        for model, weight in weights.items():
            if model in scores:
                weighted_sum += scores[model] * weight
                total_weight += weight

        ensemble_score = weighted_sum / total_weight if total_weight > 0 else 0.0
        ensemble_score = float(np.clip(ensemble_score, 0.0, 1.0))

        return {
            "scores": scores,
            "ensemble_score": ensemble_score,
            "model_count": len(scores),
        }

    def get_feature_importance(self) -> dict[str, float]:
        importances: dict[str, float] = {}
        if self.random_forest is not None:
            for i, name in enumerate(FEATURE_NAMES):
                if i < len(self.random_forest.feature_importances_):
                    importances[name] = float(self.random_forest.feature_importances_[i])
        return importances
