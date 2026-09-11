# 🛰️ FireWatch AI

> AI-powered satellite thermal intelligence platform that detects, classifies, and tracks industrial fires and persistent thermal sources across India using NASA FIRMS, OpenStreetMap, Explainable AI, and 30-Day Spatio-Temporal Analysis.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![AI](https://img.shields.io/badge/AI-RandomForest-blueviolet)
![Satellite](https://img.shields.io/badge/Data-NASA%20FIRMS-red)
![GIS](https://img.shields.io/badge/GIS-OpenStreetMap-blue)

---

## 🌐 Live Platform

<div align="center">

<a href="https://lalifirewatchai.netlify.app/">
  <img src="https://img.shields.io/badge/🔥%20OPEN%20LIVE%20PLATFORM-FireWatch%20AI-orange?style=for-the-badge&logo=netlify&logoColor=white" alt="Open FireWatch AI">
</a>

</div>

---

# 📖 Overview

**FireWatch AI** is an AI-powered satellite thermal anomaly intelligence platform designed to detect, classify, and monitor thermal sources across India.

NASA FIRMS satellite sensors detect heat signatures across India, but raw thermal anomaly data cannot directly distinguish whether the detected heat comes from an industrial fire, refinery gas flare, illegal brick kiln, coal seam fire, agricultural crop burning, natural wildfire, or temporary sensor noise.

FireWatch AI addresses this challenge by combining:

- 🛰️ Satellite telemetry
- 🗺️ OpenStreetMap industrial polygons
- 🔁 30-day persistence analysis
- 🤖 Explainable Random Forest classification
- 📊 Interactive analytics
- 📄 Automated incident reporting

The platform transforms raw satellite thermal detections into **location-aware, persistent, and explainable thermal intelligence**.

---

# 🎯 The Problem

Raw NASA FIRMS thermal detections can generate a large number of alerts.

However, a thermal anomaly does not automatically indicate an industrial accident or persistent hazard.

A detected hotspot may represent:

1. 🔥 Acute Industrial Fire
2. 🏭 Persistent Industrial Thermal Source
3. 🌾 Agricultural Crop Burning
4. 🌲 Natural Wildfire
5. ⚪ Sensor Noise or Temporary Reflection

The main challenge is determining:

> **Where is the thermal anomaly?**

> **What is causing the thermal anomaly?**

> **Is the source temporary or persistent?**

> **How important is the detected event?**

FireWatch AI addresses these questions using spatial analysis, temporal persistence detection, and explainable machine learning.

---

# 💡 Proposed Solution

FireWatch AI combines satellite telemetry, geographic information, historical thermal behavior, and machine learning into a single intelligence pipeline.

```text
NASA FIRMS Satellite Data
            │
            ▼
    Thermal Anomaly Detection
            │
            ▼
      Coordinate Extraction
            │
            ▼
   OpenStreetMap Spatial Matching
            │
            ▼
    30-Day Persistence Analysis
            │
            ▼
       Feature Engineering
            │
            ▼
    Random Forest Classifier
            │
            ▼
      Explainable AI Layer
            │
            ▼
      FireWatch AI Dashboard
            │
       ┌────┼────┬─────────┐
       ▼    ▼    ▼         ▼
      Map  XAI  Analytics Reports

      Map  XAI  Analytics Reports
```

---
## 📂 Project Structure

```text
FireWatch-AI/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── data_store.py
│   │   ├── spatial.py
│   │   ├── persistence.py
│   │   ├── classifier.py
│   │   ├── reports.py
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── test_backend.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│   ├── dashboard.png
│   ├── hotspot-map.png
│   ├── hotspot-inspector.png
│   ├── analytics.png
│   ├── persistent-sources.png
│   └── report.png
│
├── docker-compose.yml
├── start.bat
└── README.md
```

---

# 🏗️ System Architecture

FireWatch AI follows a modular architecture that connects satellite data, geospatial analysis, machine learning, and an interactive web dashboard.

```text
                    ┌──────────────────────┐
                    │     NASA FIRMS      │
                    │   MODIS / VIIRS     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        Spatial Analysis  Persistence   Feature Engineering
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Random Forest + XAI │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Dashboard   │
                    │   Leaflet Map       │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
                Map        Analytics      Reports
```
---

# ✨ Key Features

- 🛰️ **NASA FIRMS MODIS & VIIRS Satellite Hotspot Detection**
- 🏭 **OpenStreetMap Industrial Polygon Matching**
- 📍 **Point-in-Polygon & Distance Verification**
- 🔁 **30-Day Spatio-Temporal Persistence Engine**
- 🤖 **Explainable AI Random Forest Classifier**
- 🌲 **Agricultural vs Industrial vs Wildfire Classification**
- 📊 **Executive Analytics Dashboard**
- 🎞️ **Interactive 30-Day Time-Lapse Map Slider**
- 📄 **Automated Incident PDF Generator**
- 📥 **CSV Export of Classified Hotspots**
- 🌐 **Interactive India Command Center Map**
- ⚡ **Offline Dataset + Live FIRMS API Support**

---

# 🛰️ Satellite Data Processing

FireWatch AI uses NASA FIRMS thermal anomaly data as the primary satellite intelligence source.

The platform processes hotspot information such as:

- Latitude
- Longitude
- Detection Date
- Detection Time
- Fire Radiative Power (FRP)
- Satellite Source
- Confidence Level

```text
NASA FIRMS
    │
    ▼
Satellite Hotspot Data
    │
    ▼
Coordinate Processing
    │
    ▼
Data Validation
    │
    ▼
FireWatch AI Hotspot Database
```

---

# 🏭 Industrial Source Detection

FireWatch AI combines satellite hotspot coordinates with OpenStreetMap industrial information.

The system checks whether a hotspot is located inside or near an industrial area.

```text
Hotspot Coordinates
        │
        ▼
Point-in-Polygon Check
        │
        ├── Inside Industrial Polygon
        │
        └── Outside Polygon
                  │
                  ▼
          Distance Verification
                  │
                  ▼
        Nearby Industrial Source
```

This provides additional geographic context for each thermal anomaly.

---

# 📍 Spatial Intelligence

FireWatch AI performs geographic analysis using hotspot coordinates.

The platform evaluates:

- Industrial polygon containment
- Distance from industrial facilities
- Geographic proximity
- Regional hotspot concentration
- Hazard-zone distribution

This helps determine the geographic context of detected thermal anomalies.

---

# 🔁 30-Day Persistence Analysis

FireWatch AI analyzes thermal activity across a 30-day period.

Nearby detections are grouped into spatial clusters and evaluated for recurring activity.

```text
Day 01       🔥
Day 05       🔥
Day 11       🔥
Day 18       🔥
Day 27       🔥
               │
               ▼
       Spatial Clustering
               │
               ▼
       Persistence Analysis
               │
               ▼
        Persistent Source
```

Persistent activity can help identify recurring thermal sources such as:

- Industrial thermal sources
- Gas flaring
- Coal seam fires
- Recurring agricultural burning
- Long-duration thermal activity

---

# 🤖 Explainable AI Classification

FireWatch AI uses a **Random Forest classifier** to classify thermal anomalies using satellite, spatial, and temporal features.

Example features:

| Feature | Description |
|---|---|
| FRP | Fire Radiative Power |
| Confidence | Satellite detection confidence |
| Recurrence | Number of repeated detections |
| Industrial Proximity | Distance from industrial sources |
| Polygon Match | Industrial polygon relationship |
| Spatial Density | Concentration of nearby detections |
| Temporal Persistence | Recurring activity over time |

Example explanation:

```text
Industrial Polygon Match → 45%
30-Day Recurrence        → 32%
Fire Radiative Power     → 18%
Other Factors            → 5%
```

The Explainable AI layer helps users understand why a hotspot received a particular classification.

---

# 🔥 Thermal Source Classification

FireWatch AI categorizes thermal anomalies into meaningful source classes.

| Classification | Description |
|---|---|
| 🔥 Acute Industrial Fire | Sudden thermal activity associated with an industrial location |
| 🏭 Persistent Industrial Source | Repeated thermal activity near an industrial facility |
| 🌾 Agricultural Burning | Thermal activity associated with agricultural regions |
| 🌲 Natural Wildfire | Thermal activity associated with vegetation or forest regions |
| ⚪ Sensor Noise | Low-confidence or temporary thermal anomaly |

---

# 🌐 India Command Center

The FireWatch AI Command Center provides an interactive map for monitoring thermal anomalies across India.

Users can:

- View hotspot locations
- Zoom into affected regions
- Inspect individual hotspots
- Filter thermal source categories
- View industrial zones
- Identify persistent sources
- Analyze historical activity
- View classification results

---

# 🎞️ Interactive 30-Day Time-Lapse

The platform provides an interactive timeline for exploring hotspot activity over 30 days.

```text
Day 01 ─── Day 05 ─── Day 10 ─── Day 15 ─── Day 20 ─── Day 30
   🔥          🔥🔥         🔥          🔥🔥         🔥🔥🔥
```

The time-lapse helps users identify:

- New hotspots
- Recurring hotspots
- Persistent sources
- Changes in hotspot concentration
- Historical thermal patterns

---

# 📊 Executive Analytics Dashboard

The analytics dashboard provides a high-level summary of thermal activity.

Key analytics include:

- Total detected hotspots
- Persistent thermal sources
- Industrial hotspots
- Agricultural burning
- Wildfire detections
- Regional hotspot concentration
- Classification distribution
- Detection trends

---

# 🔎 Hotspot Inspector

Users can select an individual hotspot to view detailed information.

| Information | Description |
|---|---|
| Hotspot ID | Unique hotspot identifier |
| Latitude | Hotspot latitude |
| Longitude | Hotspot longitude |
| Detection Date | Satellite detection date |
| FRP | Fire Radiative Power |
| Confidence | Detection confidence |
| Classification | Predicted thermal source |
| Persistence | Historical recurrence |
| Industrial Match | Industrial geographic relationship |
| XAI Explanation | Classification reasoning |

---

# 📄 Automated Incident Report

FireWatch AI can generate a PDF report for individual thermal incidents.

The report can contain:

- Hotspot coordinates
- Detection information
- Fire Radiative Power
- Confidence level
- Thermal source classification
- Industrial facility information
- Persistence information
- Explainable AI reasoning
- Recommended investigation actions

---

# 📥 CSV Export

Classified hotspot information can be exported as CSV for further analysis.

Example fields:

```text
Hotspot ID
Latitude
Longitude
Detection Date
FRP
Confidence
Classification
Persistence
Industrial Match
Distance
```

The exported data can be used with spreadsheet, GIS, and data-analysis tools.

---

# ⚡ Offline & Live Data Support

FireWatch AI supports both offline and live satellite data workflows.

### 🗂️ Offline Dataset

A curated dataset can be used for demonstrations, testing, and analysis without requiring a live API connection.

### 🌐 Live FIRMS API

The backend can optionally ingest live NASA FIRMS data.

```text
NASA FIRMS API
       │
       ▼
 Live Data Ingestion
       │
       ▼
 FastAPI Backend
       │
       ▼
Processing & Classification
       │
       ▼
React Dashboard
```

---

---

# 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Mapping | Leaflet / React-Leaflet |
| Charts | Recharts |
| Icons | Lucide |
| Backend | FastAPI |
| Programming | Python 3.11+ |
| Machine Learning | Scikit-Learn |
| Data Processing | NumPy / Pandas |
| Spatial Analysis | Haversine / Ray Casting |
| Geographic Data | OpenStreetMap / Overpass API |
| Satellite Data | NASA FIRMS |
| PDF Reports | ReportLab |
| Deployment | Netlify |
| Containerization | Docker / Docker Compose |

---
---

# 🌐 Website Preview

<div align="center">

### FireWatch AI — Mission Intelligence Platform

**Satellite Thermal Monitoring · Geospatial Intelligence · Explainable AI**

<br>

<a href="https://lalifirewatchai.netlify.app/">
<img width="1917" height="1031" alt="Screenshot 2026-09-11 213836" src="https://github.com/user-attachments/assets/24812ac0-57c3-4557-b7f6-00cb5bff6f13" />

</a>

</div>

<br>

---

## Mission Intelligence & Analytics

<div align="center">

<img width="1917" height="1002" alt="Screenshot 2026-09-11 214057" src="https://github.com/user-attachments/assets/662ec186-83c9-4337-b98e-a2d26f33a46c" />


</div>

The analytics interface summarizes thermal activity through classification breakdowns, persistent-source statistics, monitored industrial hotspots, and false-positive reduction metrics.

---

## Live NASA FIRMS Telemetry

<div align="center">

<img width="1917" height="937" alt="Screenshot 2026-09-11 214025" src="https://github.com/user-attachments/assets/4f738acc-58b3-48f0-9f67-322ea00d7283" />

</div>

The live ingestion interface enables NASA FIRMS MODIS and VIIRS telemetry to be processed through the FireWatch AI spatial and machine-learning pipeline.

---

## Platform Capabilities

<div align="center">

| Capability | Description |
|:---|:---|
| **Satellite Intelligence** | NASA FIRMS MODIS & VIIRS thermal anomaly detection |
| **Geospatial Intelligence** | OpenStreetMap industrial-zone matching |
| **Persistence Analysis** | 30-day spatio-temporal thermal recurrence |
| **AI Classification** | Random Forest-based thermal source classification |
| **Explainable AI** | Interpretable factors behind classification results |
| **Mission Mapping** | Interactive India-wide thermal monitoring |
| **Analytics** | Thermal source and regional activity analysis |
| **Live Telemetry** | Optional NASA FIRMS data ingestion |
| **Incident Alerts** | Persistent thermal-source and orbital-pass alerts |
| **Data Export** | Classified hotspot CSV export |
| **Reporting** | Automated incident report generation |

</div>

---

## Explore the Live Platform

<div align="center">

<a href="https://lalifirewatchai.netlify.app/">

<img src="https://img.shields.io/badge/OPEN%20FIREWATCH%20AI-Live%20Platform-orange?style=for-the-badge&logo=netlify&logoColor=white">

</a>

<br><br>

**https://lalifirewatchai.netlify.app/**

</div>

---

## 👨‍💻 Developer

**Lalith Krish**

AI & Data Science Engineer

📧 Email: lalithkrish2006@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/lalithkrish-data

🐙 GitHub: https://github.com/Lalithkrish06

---
<div align="center">

### FireWatch AI

**Detect · Classify · Track · Explain**

*Satellite-powered thermal intelligence for persistent and industrial heat-source monitoring across India.*

</div>

---

### ⭐ If you found this project useful, consider giving it a Star.
---
