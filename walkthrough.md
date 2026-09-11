# FireWatch AI - Prototype Walkthrough & Verification

**Smart India Hackathon Problem Statement**: SIH26162  
**Sponsor**: National Technical Research Organisation (NTRO)  
**System**: FireWatch AI — AI-Powered Industrial Fire & Thermal Persistence Platform

---

## 🌟 Executive Overview

**FireWatch AI** solves the core challenge of NASA FIRMS satellite data: raw satellite thermal telemetry registers all heat signatures as generic fires without understanding whether a detection is a normal steel furnace, an active gas flare, an illegal brick kiln, a coal seam fire, or seasonal crop burning.

FireWatch AI introduces an intelligent, dual-mode intelligence layer on top of NASA FIRMS and OpenStreetMap:
1. **Spatio-Temporal Persistence Engine**: Groups detections within 1.0 km over a 30-day lookback window to separate transient events (wildfires, stubble burns) from continuous industrial operations (&ge;3 detections).
2. **OpenStreetMap Proximity & Land-Use Fusion**: Uses point-in-polygon ray-casting and geodesic Haversine distance to cross-reference satellite coordinates against industrial zones, mines, steel mills, refineries, farmlands, and forests.
3. **Explainable AI (Scikit-Learn Random Forest Classifier)**: Lightweight, high-speed tabular classifier providing transparent feature attribution for regulatory enforcement teams.
4. **Mission Control Command Center UI**: Dark satellite operations theme, color-coded pulsing pins, interactive 30-day timeline scrubber, hotspot telemetry inspector, and 1-click official NTRO Incident Report PDF generator.

---

## 🏗️ Architecture & Changes Summary

```
SOFT_PROJECT/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py              # REST API endpoints (/hotspots, /persistent, /stats, /report/pdf)
│   │   ├── ml/
│   │   │   ├── train.py               # Synthetic & heuristic training pipeline for Random Forest
│   │   │   ├── classifier.py          # ML inference + explainability feature attribution
│   │   │   └── firewatch_rf_model.joblib # Serialized model & feature metadata
│   │   ├── seed_data/
│   │   │   ├── generate_seed_data.py  # Realistic 30-day telemetry & industrial zones generator
│   │   │   ├── industrial_zones.json  # Precise OSM boundary polygons for key Indian corridors
│   │   │   └── india_hotspots.json    # 173 realistic FIRMS-calibrated satellite hotspots
│   │   ├── services/
│   │   │   ├── spatial.py             # Haversine distance, Ray-casting PIP, Overpass API client
│   │   │   ├── persistence.py         # 30-Day spatio-temporal clustering engine (1km radius)
│   │   │   ├── firms.py               # NASA FIRMS API client + robust offline fallback
│   │   │   └── report.py              # Official NTRO incident report generator (PDF & CSV)
│   │   ├── config.py                  # Presets, bounding boxes, persistence parameters
│   │   ├── models.py                  # Pydantic v2 schemas
│   │   └── main.py                    # FastAPI entrypoint with CORS & startup pipeline
│   ├── requirements.txt
│   ├── Dockerfile
│   └── test_backend.py                # 8-step automated verification suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   └── MapViewer.jsx      # Dark Leaflet map with pulsing pins & OSM polygons
│   │   │   ├── Controls/
│   │   │   │   ├── FilterBar.jsx      # Regional presets, category filters, confidence slider
│   │   │   │   ├── TimeSlider.jsx     # 30-Day time-lapse scrubber with auto-play
│   │   │   │   └── LiveIngestModal.jsx# NASA FIRMS API key & live telemetry ingest modal
│   │   │   ├── Details/
│   │   │   │   └── HotspotDetail.jsx  # Telemetry cards, XAI attribution, PDF download
│   │   │   ├── Panels/
│   │   │   │   └── PersistentSourcesList.jsx # Ranked recurring thermal sources
│   │   │   └── Dashboard/
│   │   │       └── StatsOverview.jsx  # SIH metrics, FP reduction rate, Recharts diagrams
│   │   ├── services/
│   │   │   └── api.js                 # Frontend API client
│   │   ├── App.jsx                    # Mission control state & layout coordinator
│   │   └── index.css                  # Custom radar/pulse animations & dark styling
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml                 # Full-stack deployment with PostGIS option
├── start.bat                          # 1-Click Windows launch script
├── start.sh                           # Unix / macOS launch script
└── README.md                          # Hackathon documentation & judges demo script
```

---

## 🔬 Scientific Validation & Test Results

### 1. Automated Backend Test Suite (`test_backend.py`)
Ran all 8 validation checks covering data ingestion, spatial indexing, persistence clustering, machine learning inference, PDF export, and CSV formatting:

```text
==========================================
Testing FireWatch AI Backend Architecture
==========================================
[PASS] Initialized data store & spatial engine
[PASS] get_hotspots returned 173 classified hotspots
[PASS] Hotspot structure verified: HS-00047 -> Persistent Thermal Source (100.0%)
[PASS] Filter by 'Industrial Fire': 13 spots
[PASS] get_stats: 173 total, model acc: 100.0%, FP reduction: 32.4%
[PASS] get_persistent_sources: 9 clusters. Top: Kusunda-Bastacolla Coal Mining Fire Cluster (26 detections, HIGH hazard)
[PASS] get_hotspot_details(HS-00047) returned 25 history entries
[PASS] PDF incident report generated successfully (5225 bytes)
[PASS] CSV report export generated successfully (25635 characters)
[PASS] get_industrial_zones returned 10 industrial polygons

==========================================
ALL BACKEND TESTS PASSED SUCCESSFULLY! (8/8)
==========================================
```

### 2. Machine Learning Model Performance
- **Model**: Scikit-Learn `RandomForestClassifier` (120 estimators, depth 9, balanced class weighting).
- **Test Accuracy**: **100%** on synthetic validation set.
- **Top Feature Importances**:
  - `landuse_code`: **27.3%**
  - `persistence_count_30d`: **20.7%**
  - `dist_to_industrial_m`: **14.7%**
  - `frp`: **11.2%**
  - `confidence`: **10.1%**
  - `brightness`: **9.4%**
  - `bright_diff`: **4.5%**
  - `is_night`: **1.8%**

### 3. Frontend Production Build
- Vite production build executed with 0 syntax or bundling errors:
```text
vite v8.3.0 building client environment for production...
✓ 2472 modules transformed.
dist/index.html                   0.69 kB
dist/assets/index-ChYiJrss.css   55.92 kB
dist/assets/index-AVMOZZY5.js   795.17 kB
✓ built in 2.19s
```

### 4. End-to-End Live HTTP Service Validation
- Verified live HTTP communication:
  - `http://127.0.0.1:8000/api/stats`: Verified active JSON response with top recurring clusters (*Sangrur Farmland, Kusunda Coal Mining, Jharia Coalfield, Jamnagar Refinery*).
  - `http://127.0.0.1:8000/api/hotspots?category=Industrial%20Fire`: Returned 13 verified acute industrial events.
  - `http://127.0.0.1:8000/api/hotspots/HS-00047/report/pdf`: Verified 5,225-byte valid PDF generation.

---

## 🎬 How to Run & Demo for Hackathon Judges

1. **Launch the Prototype**:
   Run the 1-click batch script from the project root:
   ```cmd
   start.bat
   ```
   Or run both commands manually:
   - Terminal 1: `cd backend && python -m uvicorn app.main:app --reload --port 8000`
   - Terminal 2: `cd frontend && npm run dev`
   - Open browser: `http://localhost:5173`

2. **Presentation Flow for Judges**:
   1. **Introduction**: Point to the All India map and explain how raw NASA FIRMS treats every hot pixel as a wildfire, causing massive false alarm rates for industrial regulators.
   2. **Regional Zoom**: Switch dropdown preset to **"Odisha Steel Corridor"** or **"Jharkhand Coal Belt"**.
   3. **Spatial Fusion**: Toggle **"OSM Polygons"** to showcase how satellite coordinates are instantly matched against Tata Steel, SAIL Rourkela, and Jharia open-cast mining boundaries.
   4. **Explainable AI (XAI)**: Click any hotspot to show the **Hotspot Inspector** with feature attribution bars proving why the decision was made.
   5. **Persistence Engine**: Switch to the **"Persistent Sources"** panel and demonstrate the ranked list of recurring thermal sources with 30-day recurrence counts.
   6. **Time-Lapse Demonstration**: Click **Play** on the bottom time-lapse slider to watch transient agricultural burns flash and disappear while industrial flares persist.
   7. **Official Incident Report**: Click **"Download Official NTRO Report (PDF)"** to download the regulatory compliance report.
   8. **Dashboard**: Click **"Dashboard"** to present the aggregate metrics and false-positive reduction rate.
