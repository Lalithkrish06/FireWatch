import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "seed_data"
MODEL_PATH = BASE_DIR / "app" / "ml" / "firewatch_rf_model.joblib"

# NASA FIRMS settings
NASA_FIRMS_MAP_KEY = os.getenv("NASA_FIRMS_MAP_KEY", "")
NASA_FIRMS_BASE_URL = "https://firms.modis.gsfc.nasa.gov/api/country/csv"

# OSM Overpass API endpoint
OVERPASS_API_URL = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")

# Persistence settings
PERSISTENCE_RADIUS_METERS = 1000.0  # 1 km spatial clustering threshold
PERSISTENCE_MIN_OCCURRENCES = 3     # 3 or more detections flag as persistent source
PERSISTENCE_WINDOW_DAYS = 30        # 30 days analysis window

# Coordinates bounding box for India (approx)
INDIA_BBOX = {
    "min_lat": 6.5,
    "max_lat": 36.0,
    "min_lon": 68.0,
    "max_lon": 97.5,
}

# Regional presets for demo
REGIONAL_PRESETS = {
    "india_all": {"name": "All India Overview", "lat": 22.5, "lon": 82.0, "zoom": 5},
    "odisha_steel": {"name": "Odisha Steel Corridor (Angul, Rourkela, Kalinganagar)", "lat": 21.0, "lon": 85.1, "zoom": 8},
    "jharkhand_coal": {"name": "Jharkhand Coal Belt (Jharia, Dhanbad, Bokaro)", "lat": 23.75, "lon": 86.4, "zoom": 10},
    "gujarat_petrochem": {"name": "Gujarat Petrochemical Belt (Hazira, Jamnagar)", "lat": 21.8, "lon": 71.5, "zoom": 8},
    "punjab_agri": {"name": "Punjab / Haryana Agri Stubble Fires", "lat": 30.3, "lon": 75.8, "zoom": 8},
}
