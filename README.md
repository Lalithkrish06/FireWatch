# 🔥 FireWatch AI
### AI-Based Detection & Classification of Industrial Fires and Persistent Thermal Sources
**Smart India Hackathon Problem Statement**: SIH26162 &bull; **Sponsor**: National Technical Research Organisation (NTRO)

---

## 🎯 Executive Summary & The Problem

NASA FIRMS provides raw satellite thermal anomaly detections from MODIS and VIIRS sensors. However, raw FIRMS data **does not distinguish** between:
1. **Acute Industrial Fires & Chemical Accidents** (e.g. steel furnaces, chemical storage explosions)
2. **Persistent Thermal Sources** (e.g. continuous refinery gas flaring, illegal brick kilns, subsurface coal seam fires in Jharia)
3. **Agricultural Crop Burning** (seasonal stubble burning in Punjab/Haryana farmlands)
4. **Natural Wildfires** (forest reserves)
5. **Sensor Noise & Ephemeral Reflections**

Because regulatory bodies and state pollution control boards (SPCBs) cannot deploy inspectors for thousands of unverified alerts, **FireWatch AI** bridges this gap: it fuses satellite telemetry with OpenStreetMap (OSM) industrial polygons and a 30-day spatio-temporal persistence engine powered by an explainable Random Forest classifier.

---

## 🚀 Key Features

- 🛰️ **Dual-Mode Satellite Telemetry**: Works 100% offline out-of-the-box with a curated 30-day telemetry dataset over major Indian industrial belts (Odisha Steel Corridor, Jharia Coalfields, Hazira/Jamnagar Petrochem, Sikandrabad Brick Kilns, Punjab Farmlands), and supports live NASA FIRMS API ingestion on-demand.
- 🏭 **OpenStreetMap Spatial Cross-Referencing**: Point-in-polygon verification and proximity analysis matching satellite coordinates against verified industrial, quarry, agricultural, and forest polygons.
- 🔁 **30-Day Spatio-Temporal Persistence Engine**: Clusters detections within a 1.0 km radius across 30 days to identify continuous flaring and coal seam fires that recur day after day (&ge;3 detections).
- 🌲 **Explainable AI (Random Forest Classifier)**: Lightweight, auditable machine learning model that explains *why* each point was classified (e.g. *Inside Industrial Polygon: 45%, Recurrence 24x: 32%, FRP 112 MW: 18%*).
- ⏱️ **Interactive 30-Day Time-Lapse Slider**: Scrub through dates to visualize how transient agricultural burns extinguish quickly while industrial flares and Jharia coal seam fires burn continuously.
- 📄 **Official NTRO / SPCB Incident Report Generator**: 1-click downloadable, print-ready PDF incident report featuring satellite coordinates, matched facility name, 30-day recurrence log, explainability breakdown, and recommended statutory enforcement actions under the Air Act 1981.
- 📊 **Executive Analytics Dashboard**: Instant calculation of false-positive reduction rates (saving authorities from unwarranted ground dispatches) and top hazard zones.

---

## 🛠️ Architecture & Tech Stack

```
                               ┌────────────────────────┐
                               │ NASA FIRMS Satellite   │
                               │ (MODIS / VIIRS 375m)   │
                               └───────────┬────────────┘
                                           │
 ┌──────────────────────┐                  ▼                 ┌────────────────────────┐
 │ OpenStreetMap (OSM)  │───────►  FireWatch AI Backend ◄────┤ 30-Day Spatio-Temporal │
 │ Industrial Polygons  │          (FastAPI + SciPy)         │ Persistence Engine     │
 └──────────────────────┘                  │                 └────────────────────────┘
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │ Random Forest & Rules  │
                               │ Explainable Classifier │
                               └───────────┬────────────┘
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
      ┌─────────────────────────┐                     ┌─────────────────────────┐
      │ React Command Center UI │                     │ Official NTRO Incident  │
      │ Leaflet + Dark Ops Theme│                     │ Report PDF (ReportLab)  │
      └─────────────────────────┘                     └─────────────────────────┘
```

- **Frontend**: React 19, Vite, Tailwind CSS v4, Leaflet & React-Leaflet, Recharts, Lucide Icons
- **Backend**: Python 3.11+, FastAPI, Scikit-Learn (Random Forest), NumPy, Pandas, ReportLab
- **Spatial Engine**: Geodesic Haversine clustering, Ray-Casting Point-in-Polygon, OSM Overpass API
- **Deployment**: Docker Compose & 1-click Windows/Linux startup scripts

---

## ⚡ Quick Start Guide

### Option 1: Instant 1-Click Launch (Windows)

Simply double-click `start.bat` in the root folder:
```cmd
start.bat
```
This automatically launches the FastAPI backend on `http://localhost:8000`, the React frontend on `http://localhost:5173`, and opens your browser directly to the Mission Control dashboard.

### Option 2: Manual Local Setup

#### 1. Backend:
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*(Model training runs automatically on first launch if not already cached).*

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Option 3: Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Automated Verification & Tests

Run the comprehensive test suite verifying all 8 core subsystems:
```bash
cd backend
python test_backend.py
```
**Test Results**:
- `[PASS]` Initialized data store & spatial engine
- `[PASS]` `/api/hotspots` returned 173 classified hotspots
- `[PASS]` Hotspot structure & types verified
- `[PASS]` `/api/stats` total counts and model accuracy (100%) verified
- `[PASS]` `/api/persistent` identified recurring industrial clusters
- `[PASS]` `/api/hotspots/{id}` returned telemetry + 30-day cluster history
- `[PASS]` PDF incident report generated successfully (starts with `%PDF`)
- `[PASS]` CSV report export generated successfully
- `[PASS]` `/api/industrial-zones` returned 10 active industrial polygons

---

## 🎤 Demo Script for Hackathon Judges (SIH26162)

1. **The Problem & Opening View**:
   - Open on the live India command center map (`http://localhost:5173`).
   - Explain to the judges: *"Raw NASA FIRMS satellite data only detects heat—it does not know whether a fire is an illegal industrial emission, a steel plant furnace, a gas flare, or a farmer clearing fields."*
2. **Regional Zoom - Odisha Steel Corridor & Jharia Coal Belt**:
   - Select **"Odisha Steel (Angul/Rourkela)"** or **"Jharkhand Coal (Jharia)"** from the regional preset dropdown.
   - Point out the red glowing pins (acute industrial exceedances) and orange rings (persistent thermal sources).
   - Toggle **"OSM Polygons"** to reveal the exact physical boundaries of the steel plants and mines.
3. **Inspect a Pin & Explainable AI (XAI)**:
   - Click on any hotspot (e.g. *Tata Steel Kalinganagar* or *Jharia Lodna Coalfield*).
   - Highlight the **Hotspot Inspector**:
     - Matched facility name and distance (`0m - Inside Facility Boundary`).
     - **AI Reasoning Bars**: Show how the Random Forest model is not a black box—it explicitly attributes the decision to recurrence (30-day persistence), industrial land-use match, and peak FRP.
     - 30-Day FRP thermal radiance sparkline.
4. **Persistent Sources Detector Panel**:
   - Click the **"Persistent Sources"** tab in the top navigation.
   - Show the ranked list of recurring anomalies (e.g. *Kusunda Coal Mining Fire Cluster: 26 detections, Jamnagar Flare Tower: 24 detections*).
   - Click **"Locate"** to immediately fly to that facility on the map.
5. **Generate Official NTRO Compliance PDF**:
   - Click **"Download Official NTRO Report (PDF)"**.
   - Show the generated multi-page regulatory document complete with Government of India header, telemetry metrics, facility attribution, and statutory ground inspection recommendations under the Air Act 1981.
6. **Time-Lapse Slider Demonstration**:
   - Hit **Play** on the bottom timeline slider.
   - Show how agricultural fires in Punjab are transient 1-day flashes that disappear, whereas industrial flares and coal seam fires persist continuously across all 30 days.
7. **Executive Dashboard**:
   - Click **"Dashboard"** to display the aggregate metrics:
     - **False-Positive Reduction Rate**: Demonstrates how FireWatch AI filters out **over 70% of generic satellite noise** so enforcement teams only act on verified hazards.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/hotspots` | `GET` | Filterable list of classified hotspots (`category`, `min_confidence`, `date_from`, `date_to`, `is_persistent`, `preset`) |
| `/api/hotspots/{id}` | `GET` | Single hotspot detail with 30-day cluster historical readings |
| `/api/persistent` | `GET` | Ranked list of persistent thermal anomalies with hazard index |
| `/api/stats` | `GET` | Aggregate analytics, category breakdown, top zones, and FP reduction |
| `/api/industrial-zones`| `GET` | GeoJSON polygons for steel plants, refineries, coalfields, and reserves |
| `/api/presets` | `GET` | Regional camera focus coordinates for India's major industrial hubs |
| `/api/hotspots/{id}/report/pdf` | `GET` | Official NTRO / SPCB incident report PDF |
| `/api/export/csv` | `GET` | Full CSV telemetry & classification download |
| `/api/ingest/live` | `POST` | Live NASA FIRMS API ingestion pipeline trigger |
