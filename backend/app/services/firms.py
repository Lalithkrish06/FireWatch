import csv
import io
import json
import logging
from typing import List, Dict, Any, Optional
import requests
from app.config import DATA_DIR, NASA_FIRMS_MAP_KEY, NASA_FIRMS_BASE_URL

logger = logging.getLogger("firewatch.firms")

class FIRMSService:
    def __init__(self):
        self.api_key = NASA_FIRMS_MAP_KEY

    def load_cached_seed_data(self) -> List[Dict[str, Any]]:
        """Load offline 30-day realistic satellite hotspots seed dataset."""
        seed_path = DATA_DIR / "india_hotspots.json"
        if seed_path.exists():
            with open(seed_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            logger.info(f"Loaded {len(data)} cached hotspots from {seed_path}")
            return data
        logger.warning(f"Cached seed file not found at {seed_path}")
        return []

    def fetch_live_firms_data(
        self,
        api_key: Optional[str] = None,
        source: str = "VIIRS_SNPP_NRT",
        country: str = "IND",
        days: int = 7
    ) -> List[Dict[str, Any]]:
        """
        Fetch active fire detections from NASA FIRMS API.
        Falls back safely to cached seed dataset on failure or missing key.
        """
        key = api_key or self.api_key
        if not key:
            logger.info("No NASA FIRMS API key provided. Using cached offline seed data.")
            return self.load_cached_seed_data()

        url = f"{NASA_FIRMS_BASE_URL}/{key}/{source}/{country}/{days}"
        logger.info(f"Requesting NASA FIRMS telemetry from {source} for {country} ({days} days)...")

        try:
            resp = requests.get(url, timeout=12)
            if resp.status_code == 200 and resp.text.strip():
                reader = csv.DictReader(io.StringIO(resp.text))
                hotspots = []
                idx = 1
                for row in reader:
                    lat = float(row.get("latitude", 0.0))
                    lon = float(row.get("longitude", 0.0))
                    # Support both VIIRS and MODIS CSV headers
                    brightness = float(row.get("bright_ti4") or row.get("brightness") or 300.0)
                    bright_t31 = float(row.get("bright_ti5") or row.get("bright_t31") or 290.0)
                    frp = float(row.get("frp") or 0.0)
                    
                    # Convert confidence string (l/n/h or numeric) to 0-100 float
                    conf_raw = row.get("confidence", "n").lower()
                    if conf_raw == "l" or conf_raw == "low":
                        conf = 35.0
                    elif conf_raw == "n" or conf_raw == "nominal":
                        conf = 75.0
                    elif conf_raw == "h" or conf_raw == "high":
                        conf = 95.0
                    else:
                        try:
                            conf = float(conf_raw)
                        except ValueError:
                            conf = 60.0

                    hotspots.append({
                        "id": f"FIRMS-{idx:05d}",
                        "latitude": lat,
                        "longitude": lon,
                        "brightness": brightness,
                        "bright_t31": bright_t31,
                        "frp": frp,
                        "confidence": conf,
                        "acq_date": row.get("acq_date", "2026-09-10"),
                        "acq_time": row.get("acq_time", "1200"),
                        "satellite": row.get("satellite", "VIIRS"),
                        "instrument": row.get("instrument", "VIIRS"),
                        "daynight": row.get("daynight", "D"),
                    })
                    idx += 1

                logger.info(f"Successfully retrieved {len(hotspots)} live hotspots from NASA FIRMS.")
                return hotspots
            else:
                logger.warning(f"NASA FIRMS API returned HTTP {resp.status_code}: {resp.text[:200]}. Falling back to seed data.")
        except Exception as e:
            logger.error(f"Error fetching live NASA FIRMS data: {e}. Falling back to cached seed data.")

        return self.load_cached_seed_data()

firms_service = FIRMSService()
