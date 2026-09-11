import math
import logging
from typing import List, Dict, Any, Tuple
from app.config import PERSISTENCE_RADIUS_METERS, PERSISTENCE_MIN_OCCURRENCES
from app.services.spatial import haversine_distance_m

logger = logging.getLogger("firewatch.persistence")

class PersistenceService:
    def __init__(self, radius_m: float = PERSISTENCE_RADIUS_METERS, min_count: int = PERSISTENCE_MIN_OCCURRENCES):
        self.radius_m = radius_m
        self.min_count = min_count

    def cluster_hotspots(self, hotspots: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Spatially cluster hotspots within radius_m using single-pass spatial clustering.
        Updates each hotspot with:
          - cluster_id
          - persistence_count_30d
          - is_persistent
        Returns:
          (updated_hotspots, list_of_persistent_clusters_sorted)
        """
        clusters: List[Dict[str, Any]] = []

        # Sort chronologically
        sorted_spots = sorted(hotspots, key=lambda x: (x.get("acq_date", ""), x.get("acq_time", "")))

        for spot in sorted_spots:
            lat = spot["latitude"]
            lon = spot["longitude"]
            matched_cluster = None

            for cluster in clusters:
                c_lat = cluster["center_lat"]
                c_lon = cluster["center_lon"]
                if haversine_distance_m(lat, lon, c_lat, c_lon) <= self.radius_m:
                    matched_cluster = cluster
                    break

            if matched_cluster:
                # Add point to existing cluster and update running center
                pts = matched_cluster["points"]
                pts.append(spot)
                n = len(pts)
                # Weighted or arithmetic average center
                matched_cluster["center_lat"] = round(sum(p["latitude"] for p in pts) / n, 5)
                matched_cluster["center_lon"] = round(sum(p["longitude"] for p in pts) / n, 5)
                matched_cluster["last_seen"] = max(matched_cluster["last_seen"], spot.get("acq_date", ""))
                matched_cluster["first_seen"] = min(matched_cluster["first_seen"], spot.get("acq_date", ""))
                matched_cluster["total_detections"] = n
                matched_cluster["frp_values"].append(spot.get("frp", 0.0))
            else:
                cluster_id = f"CL-{len(clusters) + 1:04d}"
                clusters.append({
                    "cluster_id": cluster_id,
                    "center_lat": lat,
                    "center_lon": lon,
                    "first_seen": spot.get("acq_date", ""),
                    "last_seen": spot.get("acq_date", ""),
                    "total_detections": 1,
                    "points": [spot],
                    "frp_values": [spot.get("frp", 0.0)]
                })

        # Enrich hotspots with cluster stats
        for cluster in clusters:
            count = cluster["total_detections"]
            is_persist = count >= self.min_count
            frps = cluster["frp_values"]
            avg_frp = round(sum(frps) / len(frps), 1) if frps else 0.0
            max_frp = round(max(frps), 1) if frps else 0.0

            cluster["avg_frp"] = avg_frp
            cluster["max_frp"] = max_frp
            cluster["is_persistent"] = is_persist

            # Hazard index
            if count >= 15 or avg_frp >= 80.0:
                cluster["hazard_level"] = "HIGH"
            elif count >= 6 or avg_frp >= 40.0:
                cluster["hazard_level"] = "MEDIUM"
            elif is_persist:
                cluster["hazard_level"] = "ELEVATED"
            else:
                cluster["hazard_level"] = "LOW"

            for p in cluster["points"]:
                p["cluster_id"] = cluster["cluster_id"]
                p["persistence_count_30d"] = count
                p["is_persistent"] = is_persist

        # Extract only clusters that meet persistence criterion
        persistent_clusters = [c for c in clusters if c["is_persistent"]]
        persistent_clusters.sort(key=lambda c: (c["total_detections"], c["avg_frp"]), reverse=True)

        logger.info(f"Clustered {len(hotspots)} spots into {len(clusters)} clusters ({len(persistent_clusters)} persistent).")
        return sorted_spots, persistent_clusters

persistence_service = PersistenceService()
