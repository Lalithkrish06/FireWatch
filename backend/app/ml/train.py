import logging
import random
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split
from app.config import MODEL_PATH

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("firewatch.train")

FEATURE_NAMES = [
    "brightness",
    "bright_diff",
    "frp",
    "confidence",
    "is_night",
    "dist_to_industrial_m",
    "is_inside_industrial",
    "persistence_count_30d",
    "landuse_code",  # 0: unknown, 1: industrial/steel/refinery, 2: quarry/coal, 3: farmland, 4: forest
]

CATEGORIES = [
    "Industrial Fire",
    "Persistent Thermal Source",
    "Agricultural Burn",
    "Wildfire",
    "Unclassified"
]

def generate_synthetic_training_data(n_samples: int = 800) -> pd.DataFrame:
    """
    Constructs a scientifically grounded training set based on satellite thermal physics,
    OSM spatial proximity, and 30-day recurrence statistics.
    """
    random.seed(42)
    np.random.seed(42)
    rows = []

    # 1. Persistent Thermal Sources (e.g. gas flares, coal seam fires, continuous brick kilns)
    for _ in range(int(n_samples * 0.25)):
        brightness = np.random.uniform(335.0, 385.0)
        bright_diff = np.random.uniform(35.0, 80.0)
        frp = np.random.uniform(35.0, 180.0)
        confidence = np.random.uniform(80.0, 100.0)
        is_night = 1 if np.random.rand() > 0.35 else 0  # Flares and seam fires visible at night
        dist = np.random.exponential(150.0)  # very close to industrial or mine
        is_inside = 1 if dist < 120 else 0
        persistence = np.random.randint(4, 30)  # highly recurring
        landuse = random.choice([1, 1, 2])  # industrial or quarry
        rows.append([brightness, bright_diff, frp, confidence, is_night, dist, is_inside, persistence, landuse, "Persistent Thermal Source"])

    # 2. Acute Industrial Fires (accidents, furnace exceedances, chemical spills)
    for _ in range(int(n_samples * 0.20)):
        brightness = np.random.uniform(350.0, 410.0)  # extremely hot
        bright_diff = np.random.uniform(45.0, 95.0)
        frp = np.random.uniform(75.0, 260.0)  # very high radiative power
        confidence = np.random.uniform(85.0, 100.0)
        is_night = 1 if np.random.rand() > 0.5 else 0
        dist = np.random.exponential(180.0)
        is_inside = 1 if dist < 150 else 0
        persistence = np.random.randint(1, 3)  # acute spike, not continuous
        landuse = 1  # industrial
        rows.append([brightness, bright_diff, frp, confidence, is_night, dist, is_inside, persistence, landuse, "Industrial Fire"])

    # 3. Agricultural Stubble Burns (paddy/wheat burning)
    for _ in range(int(n_samples * 0.25)):
        brightness = np.random.uniform(315.0, 345.0)
        bright_diff = np.random.uniform(15.0, 45.0)
        frp = np.random.uniform(5.0, 40.0)  # lower radiative power
        confidence = np.random.uniform(60.0, 90.0)
        is_night = 0  # almost exclusively daytime burns
        dist = np.random.uniform(2500.0, 25000.0)  # far from industrial zones
        is_inside = 0
        persistence = np.random.randint(1, 3)  # short ephemeral flash
        landuse = 3  # farmland
        rows.append([brightness, bright_diff, frp, confidence, is_night, dist, is_inside, persistence, landuse, "Agricultural Burn"])

    # 4. Wildfires (forest reserves)
    for _ in range(int(n_samples * 0.18)):
        brightness = np.random.uniform(330.0, 375.0)
        bright_diff = np.random.uniform(30.0, 70.0)
        frp = np.random.uniform(30.0, 140.0)
        confidence = np.random.uniform(75.0, 98.0)
        is_night = 1 if np.random.rand() > 0.4 else 0
        dist = np.random.uniform(5000.0, 50000.0)  # deep in wilderness
        is_inside = 0
        persistence = np.random.randint(1, 4)  # burns across a few days then extinguishes
        landuse = 4  # forest
        rows.append([brightness, bright_diff, frp, confidence, is_night, dist, is_inside, persistence, landuse, "Wildfire"])

    # 5. Unclassified / Low-Confidence False Positives
    for _ in range(int(n_samples * 0.12)):
        brightness = np.random.uniform(300.0, 320.0)
        bright_diff = np.random.uniform(5.0, 25.0)
        frp = np.random.uniform(1.0, 12.0)
        confidence = np.random.uniform(20.0, 58.0)  # low confidence
        is_night = 1 if np.random.rand() > 0.5 else 0
        dist = np.random.uniform(1000.0, 30000.0)
        is_inside = 0
        persistence = 1
        landuse = 0  # unknown
        rows.append([brightness, bright_diff, frp, confidence, is_night, dist, is_inside, persistence, landuse, "Unclassified"])

    df = pd.DataFrame(rows, columns=FEATURE_NAMES + ["label"])
    return df

def train_and_save_model():
    """Trains Random Forest Classifier with balanced class weights and dumps artifacts."""
    logger.info("Generating domain training dataset...")
    df = generate_synthetic_training_data(n_samples=1000)

    X = df[FEATURE_NAMES]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    logger.info(f"Training Random Forest on {len(X_train)} samples...")
    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=9,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=1
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    logger.info(f"Model Training Complete! Test Accuracy: {acc * 100:.2f}%")
    logger.info("\n" + classification_report(y_test, y_pred))

    # Feature importances
    importances = dict(zip(FEATURE_NAMES, clf.feature_importances_))
    sorted_imp = sorted(importances.items(), key=lambda x: x[1], reverse=True)
    logger.info("Global Feature Importances:")
    for feat, imp in sorted_imp:
        logger.info(f"  - {feat}: {imp * 100:.1f}%")

    # Serialize model + metadata
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    model_payload = {
        "model": clf,
        "feature_names": FEATURE_NAMES,
        "classes": clf.classes_.tolist(),
        "importances": importances,
        "accuracy": float(acc)
    }
    joblib.dump(model_payload, MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")
    return model_payload

if __name__ == "__main__":
    train_and_save_model()
