from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class NearestFacility(BaseModel):
    name: str
    landuse_type: str
    distance_m: float
    osm_id: Optional[str] = None
    facility_type: Optional[str] = None
    state: Optional[str] = "India"
    district: Optional[str] = "General District"
    description: Optional[str] = None

class ExplainabilityFactor(BaseModel):
    feature: str
    weight: float
    importance_pct: float
    description: str

class Hotspot(BaseModel):
    id: str
    latitude: float
    longitude: float
    brightness: float
    bright_t31: Optional[float] = None
    frp: float
    confidence: float
    acq_date: str
    acq_time: str
    satellite: str = "VIIRS-SNPP"
    instrument: str = "VIIRS"
    daynight: str = "D"
    
    # Classification outputs
    category: str = "Unclassified"
    classification_confidence: float = 0.0
    is_persistent: bool = False
    persistence_count_30d: int = 1
    cluster_id: Optional[str] = None
    nearest_facility: Optional[NearestFacility] = None
    explainability: List[ExplainabilityFactor] = []
    region_tag: Optional[str] = None
    state: Optional[str] = "India"
    district: Optional[str] = "General District"
    description: Optional[str] = None

class PersistentCluster(BaseModel):
    cluster_id: str
    latitude: float
    longitude: float
    facility_name: str
    landuse_type: str
    state: Optional[str] = "India"
    district: Optional[str] = "General District"
    description: Optional[str] = None
    first_seen: str
    last_seen: str
    total_detections: int
    avg_frp: float
    max_frp: float
    category: str
    hazard_level: str  # "HIGH", "MEDIUM", "ELEVATED", "LOW"
    historical_points: List[Dict[str, Any]] = []

class CategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float
    color: str

class TopZoneStat(BaseModel):
    zone_name: str
    state: str
    detection_count: int
    persistent_count: int
    hazard_level: str

class StatsResponse(BaseModel):
    total_hotspots: int
    active_today: int
    active_last_7_days: int
    industrial_fires_count: int
    persistent_sources_count: int
    agri_burns_count: int
    wildfires_count: int
    unclassified_count: int
    breakdown: List[CategoryBreakdown]
    top_zones: List[TopZoneStat]
    false_positive_reduction_pct: float
    model_accuracy_pct: float

class LiveIngestRequest(BaseModel):
    firms_api_key: Optional[str] = None
    source: str = "VIIRS_SNPP_NRT"
    country: str = "IND"
    days: int = 7

class IngestResponse(BaseModel):
    status: str
    message: str
    total_ingested: int
    classified_counts: Dict[str, int]
