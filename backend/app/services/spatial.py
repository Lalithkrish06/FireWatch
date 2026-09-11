import json
import math
import logging
from typing import List, Dict, Any, Optional, Tuple
import requests
from app.config import DATA_DIR, OVERPASS_API_URL

logger = logging.getLogger("firewatch.spatial")

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in meters between two lat/lon points on Earth."""
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def point_in_polygon(lat: float, lon: float, polygon: List[List[float]]) -> bool:
    """
    Ray casting algorithm to determine if a point (lat, lon) is inside a polygon.
    Polygon is a list of [lat, lon] vertices.
    """
    if not polygon or len(polygon) < 3:
        return False

    inside = False
    n = len(polygon)
    p1_lat, p1_lon = polygon[0]

    for i in range(1, n + 1):
        p2_lat, p2_lon = polygon[i % n]
        if min(p1_lat, p2_lat) < lat <= max(p1_lat, p2_lat):
            if lon <= max(p1_lon, p2_lon):
                if p1_lat != p2_lat:
                    x_inters = (lat - p1_lat) * (p2_lon - p1_lon) / (p2_lat - p1_lat) + p1_lon
                    if p1_lon == p2_lon or lon <= x_inters:
                        inside = not inside
        p1_lat, p1_lon = p2_lat, p2_lon

    return inside

def point_to_polygon_distance_m(lat: float, lon: float, polygon: List[List[float]]) -> float:
    """
    Calculate minimum distance from a point to a polygon.
    If point is inside, distance is 0.
    Otherwise, returns distance to the closest vertex or edge.
    """
    if point_in_polygon(lat, lon, polygon):
        return 0.0

    min_dist = float('inf')
    n = len(polygon)
    for i in range(n):
        v1 = polygon[i]
        dist = haversine_distance_m(lat, lon, v1[0], v1[1])
        if dist < min_dist:
            min_dist = dist
    return min_dist

class SpatialService:
    def __init__(self):
        self.zones: List[Dict[str, Any]] = []
        self.load_zones()

    def load_zones(self):
        zones_file = DATA_DIR / "industrial_zones.json"
        if zones_file.exists():
            with open(zones_file, "r", encoding="utf-8") as f:
                self.zones = json.load(f)
            logger.info(f"Loaded {len(self.zones)} industrial/reference zones.")
        else:
            logger.warning(f"Industrial zones file not found at {zones_file}")

    def get_all_zones(self) -> List[Dict[str, Any]]:
        return self.zones

    def find_nearest_zone(self, lat: float, lon: float) -> Tuple[Optional[Dict[str, Any]], float, bool]:
        """
        Finds the closest zone to the given coordinates.
        Returns: (nearest_zone_dict, distance_in_meters, is_inside_polygon)
        """
        if not self.zones:
            return None, float('inf'), False

        nearest_zone = None
        min_distance = float('inf')
        is_inside = False

        for zone in self.zones:
            polygon = zone.get("polygon", [])
            if point_in_polygon(lat, lon, polygon):
                return zone, 0.0, True

            center = zone.get("center", [0.0, 0.0])
            dist_to_center = haversine_distance_m(lat, lon, center[0], center[1])
            dist_to_poly = point_to_polygon_distance_m(lat, lon, polygon)
            effective_dist = min(dist_to_center, dist_to_poly)

            if effective_dist < min_distance:
                min_distance = effective_dist
                nearest_zone = zone

        return nearest_zone, min_distance, (min_distance == 0.0)

    def query_overpass_live(self, lat: float, lon: float, radius_m: int = 2000) -> Optional[Dict[str, Any]]:
        """
        Query OSM Overpass API dynamically for tags within radius_m of a hotspot.
        Gracefully falls back to local spatial lookup on timeout/failure.
        """
        query = f"""
        [out:json][timeout:5];
        (
          node["landuse"="industrial"](around:{radius_m},{lat},{lon});
          way["landuse"="industrial"](around:{radius_m},{lat},{lon});
          relation["landuse"="industrial"](around:{radius_m},{lat},{lon});
          node["man_made"="works"](around:{radius_m},{lat},{lon});
          way["man_made"="works"](around:{radius_m},{lat},{lon});
          node["industrial"](around:{radius_m},{lat},{lon});
          way["industrial"](around:{radius_m},{lat},{lon});
          node["landuse"="quarry"](around:{radius_m},{lat},{lon});
          way["landuse"="quarry"](around:{radius_m},{lat},{lon});
        );
        out tags center 3;
        """
        try:
            resp = requests.post(OVERPASS_API_URL, data={"data": query}, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                elements = data.get("elements", [])
                if elements:
                    elem = elements[0]
                    tags = elem.get("tags", {})
                    name = tags.get("name") or tags.get("operator") or "OSM Industrial Facility"
                    landuse = tags.get("landuse") or tags.get("industrial") or "industrial"
                    c_lat = elem.get("lat") or elem.get("center", {}).get("lat", lat)
                    c_lon = elem.get("lon") or elem.get("center", {}).get("lon", lon)
                    dist = haversine_distance_m(lat, lon, c_lat, c_lon)
                    return {
                        "name": name,
                        "landuse_type": landuse,
                        "distance_m": round(dist, 1),
                        "osm_id": f"{elem.get('type')}/{elem.get('id')}",
                        "tags": tags
                    }
        except Exception as e:
            logger.debug(f"Overpass live query skipped: {e}")

        # Fallback to local catalog
        zone, dist, inside = self.find_nearest_zone(lat, lon)
        if zone:
            return {
                "name": zone.get("name"),
                "landuse_type": zone.get("landuse", "industrial"),
                "distance_m": round(dist, 1),
                "osm_id": zone.get("id"),
                "tags": zone.get("tags", {})
            }
        return None

# Singleton instance
spatial_service = SpatialService()
