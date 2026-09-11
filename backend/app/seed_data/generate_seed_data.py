import json
import math
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

SEED_DIR = Path(__file__).resolve().parent
SEED_DIR.mkdir(parents=True, exist_ok=True)

# 1. DEFINE INDUSTRIAL & REFERENCE ZONES
ZONES = [
    {
        "id": "ind-od-01",
        "name": "Tata Steel Plant Kalinganagar",
        "type": "steel_plant",
        "landuse": "industrial",
        "state": "Odisha",
        "district": "Jajpur",
        "center": [20.9570, 86.0120],
        "polygon": [
            [20.9480, 86.0020],
            [20.9660, 86.0020],
            [20.9660, 86.0220],
            [20.9480, 86.0220],
            [20.9480, 86.0020]
        ],
        "tags": {"man_made": "works", "industrial": "steel", "operator": "Tata Steel Ltd"}
    },
    {
        "id": "ind-od-02",
        "name": "Jindal Steel & Power Integrated Complex",
        "type": "steel_plant",
        "landuse": "industrial",
        "state": "Odisha",
        "district": "Angul",
        "center": [20.8450, 85.1200],
        "polygon": [
            [20.8350, 85.1050],
            [20.8550, 85.1050],
            [20.8550, 85.1350],
            [20.8350, 85.1350],
            [20.8350, 85.1050]
        ],
        "tags": {"man_made": "works", "industrial": "steel_and_power", "operator": "JSPL"}
    },
    {
        "id": "ind-od-03",
        "name": "Rourkela Steel Plant (SAIL)",
        "type": "steel_plant",
        "landuse": "industrial",
        "state": "Odisha",
        "district": "Sundargarh",
        "center": [22.2150, 84.8600],
        "polygon": [
            [22.2020, 84.8450],
            [22.2280, 84.8450],
            [22.2280, 84.8750],
            [22.2020, 84.8750],
            [22.2020, 84.8450]
        ],
        "tags": {"man_made": "works", "industrial": "metallurgy", "operator": "SAIL"}
    },
    {
        "id": "ind-jh-01",
        "name": "Jharia Coalfield Seam Fire Zone (Lodna/Tisra)",
        "type": "coal_mine_fire",
        "landuse": "quarry",
        "state": "Jharkhand",
        "district": "Dhanbad",
        "center": [23.7420, 86.4180],
        "polygon": [
            [23.7300, 86.4050],
            [23.7550, 86.4050],
            [23.7550, 86.4320],
            [23.7300, 86.4320],
            [23.7300, 86.4050]
        ],
        "tags": {"landuse": "quarry", "mining": "coal_open_cast", "subsurface_fire": "active"}
    },
    {
        "id": "ind-jh-02",
        "name": "Kusunda-Bastacolla Coal Mining Fire Cluster",
        "type": "coal_mine_fire",
        "landuse": "quarry",
        "state": "Jharkhand",
        "district": "Dhanbad",
        "center": [23.7710, 86.4020],
        "polygon": [
            [23.7600, 86.3900],
            [23.7820, 86.3900],
            [23.7820, 86.4150],
            [23.7600, 86.4150],
            [23.7600, 86.3900]
        ],
        "tags": {"landuse": "quarry", "mining": "coal_underground_seam", "hazard": "high"}
    },
    {
        "id": "ind-gj-01",
        "name": "Jamnagar Mega Refinery & Flare Tower Complex",
        "type": "oil_refinery",
        "landuse": "industrial",
        "state": "Gujarat",
        "district": "Jamnagar",
        "center": [22.3550, 69.8700],
        "polygon": [
            [22.3400, 69.8500],
            [22.3700, 69.8500],
            [22.3700, 69.8900],
            [22.3400, 69.8900],
            [22.3400, 69.8500]
        ],
        "tags": {"man_made": "works", "industrial": "oil_refinery", "operator": "Reliance Industries"}
    },
    {
        "id": "ind-gj-02",
        "name": "Hazira Petrochemical & Heavy Industry Corridor",
        "type": "petrochemical",
        "landuse": "industrial",
        "state": "Gujarat",
        "district": "Surat",
        "center": [21.1250, 72.6700],
        "polygon": [
            [21.1100, 72.6500],
            [21.1400, 72.6500],
            [21.1400, 72.6900],
            [21.1100, 72.6900],
            [21.1100, 72.6500]
        ],
        "tags": {"landuse": "industrial", "industrial": "petrochemical_and_lng"}
    },
    {
        "id": "ind-up-01",
        "name": "Sikandrabad Brick Kiln Belt",
        "type": "brick_kiln_cluster",
        "landuse": "industrial",
        "state": "Uttar Pradesh",
        "district": "Bulandshahr",
        "center": [28.4500, 77.6500],
        "polygon": [
            [28.4350, 77.6350],
            [28.4650, 77.6350],
            [28.4650, 77.6650],
            [28.4350, 77.6650],
            [28.4350, 77.6350]
        ],
        "tags": {"industrial": "brick_kiln", "compliance": "frequent_non_compliant_firing"}
    },
    {
        "id": "agri-pb-01",
        "name": "Sangrur Agricultural Belt",
        "type": "farmland",
        "landuse": "farmland",
        "state": "Punjab",
        "district": "Sangrur",
        "center": [30.2450, 75.8450],
        "polygon": [
            [30.2200, 75.8100],
            [30.2700, 75.8100],
            [30.2700, 75.8800],
            [30.2200, 75.8800],
            [30.2200, 75.8100]
        ],
        "tags": {"landuse": "farmland", "crop": "paddy_wheat"}
    },
    {
        "id": "for-od-01",
        "name": "Simlipal Biosphere Reserve Core",
        "type": "forest_reserve",
        "landuse": "forest",
        "state": "Odisha",
        "district": "Mayurbhanj",
        "center": [21.8500, 86.3500],
        "polygon": [
            [21.8000, 86.3000],
            [21.9000, 86.3000],
            [21.9000, 86.4000],
            [21.8000, 86.4000],
            [21.8000, 86.3000]
        ],
        "tags": {"leisure": "nature_reserve", "natural": "wood"}
    }
]

with open(SEED_DIR / "industrial_zones.json", "w", encoding="utf-8") as f:
    json.dump(ZONES, f, indent=2)

print(f"Saved {len(ZONES)} zones to industrial_zones.json")

# 2. GENERATE 30-DAY TEMPORAL HOTSPOTS SERIES
base_date = datetime(2026, 9, 10)
hotspots = []
hotspot_counter = 1

# A. Persistent Industrial Flare / Gas Source (Jamnagar Refinery)
# Flare stack coords
flare_lat, flare_lon = 22.3552, 69.8698
for day_offset in range(30):
    if day_offset % 4 != 0: # 75% persistence
        det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
        jitter_lat = flare_lat + random.uniform(-0.0015, 0.0015)
        jitter_lon = flare_lon + random.uniform(-0.0015, 0.0015)
        hotspots.append({
            "id": f"HS-{hotspot_counter:05d}",
            "latitude": round(jitter_lat, 5),
            "longitude": round(jitter_lon, 5),
            "brightness": round(random.uniform(335.0, 368.0), 1),
            "bright_t31": round(random.uniform(294.0, 305.0), 1),
            "frp": round(random.uniform(45.0, 110.0), 1),
            "confidence": round(random.uniform(85.0, 99.0), 1),
            "acq_date": det_date,
            "acq_time": f"{random.choice(['01','02','13','14'])}{random.choice(['15','30','45','50'])}",
            "satellite": random.choice(["VIIRS-SNPP", "NOAA-20"]),
            "instrument": "VIIRS",
            "daynight": random.choice(["N", "N", "D"]),
            "target_zone": "ind-gj-01",
            "ground_truth_category": "Persistent Thermal Source"
        })
        hotspot_counter += 1

# B. Persistent Coal Seam Fires in Jharia (Lodna & Kusunda)
for zone_id, c_lat, c_lon in [("ind-jh-01", 23.7420, 86.4180), ("ind-jh-02", 23.7710, 86.4020)]:
    for day_offset in range(30):
        if random.random() > 0.15: # highly continuous
            det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
            hotspots.append({
                "id": f"HS-{hotspot_counter:05d}",
                "latitude": round(c_lat + random.uniform(-0.003, 0.003), 5),
                "longitude": round(c_lon + random.uniform(-0.003, 0.003), 5),
                "brightness": round(random.uniform(340.0, 385.0), 1),
                "bright_t31": round(random.uniform(298.0, 310.0), 1),
                "frp": round(random.uniform(60.0, 185.0), 1),
                "confidence": round(random.uniform(88.0, 100.0), 1),
                "acq_date": det_date,
                "acq_time": f"{random.choice(['08','09','19','20'])}{random.choice(['10','25','40'])}",
                "satellite": "VIIRS-SNPP",
                "instrument": "VIIRS",
                "daynight": random.choice(["D", "N"]),
                "target_zone": zone_id,
                "ground_truth_category": "Persistent Thermal Source"
            })
            hotspot_counter += 1

# C. Acute Industrial Fires / Furnace Exceedances (Odisha Steel corridor)
for zone_id, c_lat, c_lon in [("ind-od-01", 20.9570, 86.0120), ("ind-od-02", 20.8450, 85.1200), ("ind-od-03", 22.2150, 84.8600)]:
    for day_offset in [0, 1, 2, 7, 14]:
        det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
        hotspots.append({
            "id": f"HS-{hotspot_counter:05d}",
            "latitude": round(c_lat + random.uniform(-0.002, 0.002), 5),
            "longitude": round(c_lon + random.uniform(-0.002, 0.002), 5),
            "brightness": round(random.uniform(355.0, 398.0), 1),
            "bright_t31": round(random.uniform(300.0, 312.0), 1),
            "frp": round(random.uniform(85.0, 240.0), 1),
            "confidence": round(random.uniform(90.0, 100.0), 1),
            "acq_date": det_date,
            "acq_time": f"{random.choice(['03','04','15','16'])}{random.choice(['05','20','35'])}",
            "satellite": "VIIRS-SNPP",
            "instrument": "VIIRS",
            "daynight": random.choice(["D", "N"]),
            "target_zone": zone_id,
            "ground_truth_category": "Industrial Fire"
        })
        hotspot_counter += 1

# D. Brick Kiln Firing (Sikandrabad)
bk_lat, bk_lon = 28.4500, 77.6500
for day_offset in range(30):
    if day_offset % 3 == 0:
        det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
        hotspots.append({
            "id": f"HS-{hotspot_counter:05d}",
            "latitude": round(bk_lat + random.uniform(-0.004, 0.004), 5),
            "longitude": round(bk_lon + random.uniform(-0.004, 0.004), 5),
            "brightness": round(random.uniform(325.0, 345.0), 1),
            "bright_t31": round(random.uniform(292.0, 300.0), 1),
            "frp": round(random.uniform(20.0, 48.0), 1),
            "confidence": round(random.uniform(70.0, 88.0), 1),
            "acq_date": det_date,
            "acq_time": f"{random.choice(['07','08','12','13'])}{random.choice(['10','30'])}",
            "satellite": "NOAA-20",
            "instrument": "VIIRS",
            "daynight": "D",
            "target_zone": "ind-up-01",
            "ground_truth_category": "Persistent Thermal Source"
        })
        hotspot_counter += 1

# E. Agricultural Burning (Punjab farmland stubble)
agri_lat, agri_lon = 30.2450, 75.8450
for i in range(40):
    day_offset = random.randint(0, 29)
    det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
    hotspots.append({
        "id": f"HS-{hotspot_counter:05d}",
        "latitude": round(agri_lat + random.uniform(-0.15, 0.15), 5),
        "longitude": round(agri_lon + random.uniform(-0.15, 0.15), 5),
        "brightness": round(random.uniform(315.0, 340.0), 1),
        "bright_t31": round(random.uniform(295.0, 303.0), 1),
        "frp": round(random.uniform(8.0, 35.0), 1),
        "confidence": round(random.uniform(65.0, 85.0), 1),
        "acq_date": det_date,
        "acq_time": f"{random.choice(['11','12','13','14'])}{random.choice(['05','25','45'])}",
        "satellite": random.choice(["VIIRS-SNPP", "MODIS-Terra"]),
        "instrument": random.choice(["VIIRS", "MODIS"]),
        "daynight": "D",
        "target_zone": "agri-pb-01",
        "ground_truth_category": "Agricultural Burn"
    })
    hotspot_counter += 1

# F. Wildfire episode in Simlipal Forest
forest_lat, forest_lon = 21.8500, 86.3500
for day_offset in [10, 11, 12, 13]:
    det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
    for _ in range(5):
        hotspots.append({
            "id": f"HS-{hotspot_counter:05d}",
            "latitude": round(forest_lat + random.uniform(-0.04, 0.04), 5),
            "longitude": round(forest_lon + random.uniform(-0.04, 0.04), 5),
            "brightness": round(random.uniform(330.0, 370.0), 1),
            "bright_t31": round(random.uniform(296.0, 305.0), 1),
            "frp": round(random.uniform(35.0, 120.0), 1),
            "confidence": round(random.uniform(80.0, 95.0), 1),
            "acq_date": det_date,
            "acq_time": f"{random.choice(['10','11','21','22'])}{random.choice(['15','30'])}",
            "satellite": "VIIRS-SNPP",
            "instrument": "VIIRS",
            "daynight": random.choice(["D", "N"]),
            "target_zone": "for-od-01",
            "ground_truth_category": "Wildfire"
        })
        hotspot_counter += 1

# G. Unclassified / Low confidence false positives
for i in range(15):
    day_offset = random.randint(0, 29)
    det_date = (base_date - timedelta(days=day_offset)).strftime("%Y-%m-%d")
    hotspots.append({
        "id": f"HS-{hotspot_counter:05d}",
        "latitude": round(21.0 + random.uniform(0, 5), 5),
        "longitude": round(75.0 + random.uniform(0, 5), 5),
        "brightness": round(random.uniform(305.0, 315.0), 1),
        "bright_t31": round(random.uniform(295.0, 300.0), 1),
        "frp": round(random.uniform(3.0, 9.0), 1),
        "confidence": round(random.uniform(30.0, 55.0), 1),
        "acq_date": det_date,
        "acq_time": f"{random.choice(['05','06','17'])}{random.choice(['10','40'])}",
        "satellite": "MODIS-Terra",
        "instrument": "MODIS",
        "daynight": "D",
        "target_zone": None,
        "ground_truth_category": "Unclassified"
    })
    hotspot_counter += 1

with open(SEED_DIR / "india_hotspots.json", "w", encoding="utf-8") as f:
    json.dump(hotspots, f, indent=2)

print(f"Generated {len(hotspots)} realistic hotspots over 30 days into india_hotspots.json")
