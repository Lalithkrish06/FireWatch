# 🛰️ FireWatch AI — Satellite Thermal Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Active">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/AI-Random%20Forest-8A2BE2?style=for-the-badge" alt="Random Forest">
  <img src="https://img.shields.io/badge/NASA%20FIRMS-Satellite%20Data-red?style=for-the-badge" alt="NASA FIRMS">
  <img src="https://img.shields.io/badge/GIS-OpenStreetMap-blue?style=for-the-badge" alt="OpenStreetMap">
</p>

<p align="center">
  <strong>Detect • Classify • Track • Explain</strong>
  <br><br>
  An AI-powered satellite thermal intelligence platform for detecting, classifying, and monitoring industrial fires and persistent thermal sources across India.
</p>

---

# 🌐 Live Platform

<div align="center">

### 🔥 Explore FireWatch AI

<a href="https://lalifirewatchai.netlify.app/">
  <img src="https://img.shields.io/badge/🔥%20OPEN%20LIVE%20PLATFORM-FireWatch%20AI-orange?style=for-the-badge&logo=netlify&logoColor=white" alt="Open FireWatch AI">
</a>

</div>

---

# 🎥 Project Demonstration

<div align="center">

### 🛰️ FireWatch AI — Mission Intelligence in Action

<a href="https://www.linkedin.com/">
  <img src="https://img.shields.io/badge/▶%20Project%20Demonstration-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Project Demonstration">
</a>

</div>

---

# 📖 Project Overview

**FireWatch AI** is an AI-powered satellite thermal anomaly intelligence platform designed to detect, classify, and monitor thermal sources across India.

The platform combines **NASA FIRMS satellite telemetry, OpenStreetMap industrial data, 30-day persistence analysis, explainable machine learning, geospatial intelligence, and interactive analytics** to transform raw thermal detections into meaningful intelligence.

```text
🛰️ Satellite Data
       +
🗺️ Geospatial Intelligence
       +
🔁 Temporal Persistence
       +
🤖 Explainable AI
       +
📊 Interactive Analytics
       ↓
🔥 FireWatch AI
```

The system is designed to help distinguish different thermal-source categories and provide location-aware, persistent, and explainable information for further analysis.

---

# 🎯 The Problem

Satellite thermal sensors can detect large numbers of heat signatures, but a detected hotspot does not automatically indicate an industrial accident or persistent hazard.

A thermal anomaly may represent:

- 🔥 Acute Industrial Fire
- 🏭 Persistent Industrial Thermal Source
- 🌾 Agricultural Crop Burning
- 🌲 Natural Wildfire
- ⚪ Sensor Noise or Temporary Reflection

FireWatch AI focuses on answering four critical questions:

> **Where is the thermal anomaly?**
>
> **What could be causing the thermal anomaly?**
>
> **Is the activity temporary or persistent?**
>
> **How significant is the detected event?**

---

# 💡 Proposed Solution

FireWatch AI connects satellite telemetry, geographic information, historical thermal behavior, and machine learning into one intelligence pipeline.

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
     ┌──────┼───────┬──────────┐
     ▼      ▼       ▼          ▼
    Map    XAI   Analytics   Reports
```

---

# ✨ Key Capabilities

| Capability | Description |
|---|---|
| 🛰️ **Satellite Intelligence** | NASA FIRMS MODIS & VIIRS thermal anomaly detection |
| 🏭 **Industrial Detection** | OpenStreetMap industrial polygon matching |
| 📍 **Spatial Intelligence** | Geographic containment and distance verification |
| 🔁 **Persistence Analysis** | 30-day spatio-temporal recurrence analysis |
| 🤖 **AI Classification** | Random Forest thermal-source classification |
| 🧠 **Explainable AI** | Interpretable classification factors |
| 🗺️ **India Command Center** | Interactive nationwide thermal monitoring |
| 🎞️ **Time-Lapse Analysis** | Explore thermal activity across 30 days |
| 📊 **Executive Analytics** | High-level thermal activity insights |
| 📄 **Incident Reports** | Automated PDF incident generation |
| 📥 **Data Export** | Classified hotspot CSV export |
| 🌐 **Live Telemetry** | Optional NASA FIRMS API integration |
| ⚡ **Offline Support** | Curated datasets for offline analysis |
| 🚨 **Incident Alerts** | Persistent thermal-source and orbital-pass alerts |

---

# 🛰️ Satellite Data Intelligence

FireWatch AI uses **NASA FIRMS thermal anomaly data** as its primary satellite intelligence source.

The platform processes information including:

- 📍 Latitude
- 📍 Longitude
- 📅 Detection Date
- 🕐 Detection Time
- 🔥 Fire Radiative Power (FRP)
- 🛰️ Satellite Source
- 🎯 Detection Confidence

### Data Processing Pipeline

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

The system evaluates whether a detected hotspot is located inside or near an industrial region.

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

This provides additional geographic context for detected thermal anomalies.

---

# 📍 Spatial Intelligence

The platform performs geographic analysis using hotspot coordinates.

### Spatial Factors

- Industrial polygon containment
- Distance from industrial facilities
- Geographic proximity
- Regional hotspot concentration
- Hazard-zone distribution

This spatial context helps determine the relationship between thermal anomalies and surrounding geographic features.

---

# 🔁 30-Day Persistence Analysis

FireWatch AI analyzes thermal activity across a **30-day period** to identify recurring and persistent thermal sources.

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

Persistent activity can help identify recurring thermal patterns such as:

- 🏭 Industrial thermal sources
- 🔥 Gas flaring
- ⛏️ Coal seam fires
- 🌾 Recurring agricultural burning
- 🔥 Long-duration thermal activity

---

# 🤖 Explainable AI Classification

FireWatch AI uses a **Random Forest classifier** to classify thermal anomalies using satellite, spatial, and temporal features.

### Example Features

| Feature | Description |
|---|---|
| 🔥 FRP | Fire Radiative Power |
| 🎯 Confidence | Satellite detection confidence |
| 🔁 Recurrence | Number of repeated detections |
| 🏭 Industrial Proximity | Distance from industrial sources |
| 📍 Polygon Match | Industrial polygon relationship |
| 📊 Spatial Density | Concentration of nearby detections |
| ⏱️ Temporal Persistence | Recurring activity over time |

### Example XAI Explanation

```text
Industrial Polygon Match → 45%
30-Day Recurrence        → 32%
Fire Radiative Power     → 18%
Other Factors            →  5%
```

The Explainable AI layer helps users understand the factors contributing to a classification.

---

# 🔥 Thermal Source Classification

FireWatch AI categorizes thermal anomalies into meaningful source classes.

| Classification | Description |
|---|---|
| 🔥 **Acute Industrial Fire** | Sudden thermal activity associated with an industrial location |
| 🏭 **Persistent Industrial Source** | Repeated thermal activity near an industrial facility |
| 🌾 **Agricultural Burning** | Thermal activity associated with agricultural regions |
| 🌲 **Natural Wildfire** | Thermal activity associated with vegetation or forest regions |
| ⚪ **Sensor Noise** | Low-confidence or temporary thermal anomaly |

---

# 🌐 India Command Center

The FireWatch AI Command Center provides an interactive map for monitoring thermal anomalies across India.

### Users Can

- 📍 View hotspot locations
- 🔎 Zoom into affected regions
- 🔬 Inspect individual hotspots
- 🏷️ Filter thermal-source categories
- 🏭 View industrial zones
- 🔁 Identify persistent sources
- 📊 Analyze historical activity
- 🤖 View classification results

---

# 🎞️ Interactive 30-Day Time-Lapse

The platform provides an interactive timeline for exploring hotspot activity over a 30-day period.

```text
Day 01 ─── Day 05 ─── Day 10 ─── Day 15 ─── Day 20 ─── Day 30
   🔥        🔥🔥        🔥        🔥🔥       🔥🔥        🔥🔥🔥
```

### Time-Lapse Intelligence

- 🆕 New hotspots
- 🔁 Recurring hotspots
- 🏭 Persistent sources
- 📈 Changes in hotspot concentration
- 📊 Historical thermal patterns

---

# 📊 Executive Analytics Dashboard

The analytics dashboard provides a high-level overview of thermal activity.

### Analytics

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

Users can select individual hotspots and inspect detailed information.

| Information | Description |
|---|---|
| 🆔 Hotspot ID | Unique hotspot identifier |
| 📍 Latitude | Hotspot latitude |
| 📍 Longitude | Hotspot longitude |
| 📅 Detection Date | Satellite detection date |
| 🔥 FRP | Fire Radiative Power |
| 🎯 Confidence | Detection confidence |
| 🤖 Classification | Predicted thermal source |
| 🔁 Persistence | Historical recurrence |
| 🏭 Industrial Match | Industrial geographic relationship |
| 🧠 XAI Explanation | Classification reasoning |

---

# 📄 Automated Incident Reporting

FireWatch AI can generate PDF reports for individual thermal incidents.

### Reports Can Include

- Hotspot coordinates
- Detection information
- Fire Radiative Power
- Confidence level
- Thermal-source classification
- Industrial facility information
- Persistence information
- Explainable AI reasoning
- Recommended investigation actions

---

# 📥 CSV Data Export

Classified hotspot information can be exported for further analysis.

### Example Fields

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

Exported data can be further analyzed using spreadsheet, GIS, and data-analysis tools.

---

# ⚡ Offline & Live Data Support

FireWatch AI supports both offline and live satellite-data workflows.

### 🗂️ Offline Dataset

A curated dataset can be used for:

- Demonstrations
- Testing
- Development
- Data analysis
- Offline exploration

### 🌐 Live NASA FIRMS API

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

# 🏗️ System Architecture

```text
              ┌─────────────────────┐
              │     NASA FIRMS      │
              │    MODIS / VIIRS    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   FastAPI Backend   │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Spatial Analysis   Persistence   Feature Engineering
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Random Forest + XAI │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   React Dashboard   │
              │   Leaflet Mapping   │
              └──────────┬──────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
             Map     Analytics   Reports
```

---

# 🛠️ Technology Stack

| Category | Technology |
|---|---|
| ⚛️ Frontend | React 19 |
| ⚡ Build Tool | Vite |
| 🎨 Styling | Tailwind CSS v4 |
| 🗺️ Mapping | Leaflet / React-Leaflet |
| 📊 Charts | Recharts |
| 🎯 Icons | Lucide |
| 🚀 Backend | FastAPI |
| 🐍 Programming | Python 3.11+ |
| 🤖 Machine Learning | Scikit-Learn |
| 📊 Data Processing | NumPy / Pandas |
| 📍 Spatial Analysis | Haversine / Ray Casting |
| 🗺️ Geographic Data | OpenStreetMap / Overpass API |
| 🛰️ Satellite Data | NASA FIRMS |
| 📄 PDF Reports | ReportLab |
| ☁️ Deployment | Netlify |
| 🐳 Containerization | Docker / Docker Compose |

---

# 📂 Project Structure

```text
FireWatch/
│
├── 📁 backend/
│   ├── 📁 app/
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
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── 📁 screenshots/
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

# 📸 Platform Showcase

## 🌐 Mission Intelligence Platform

<div align="center">

### FireWatch AI — Mission Intelligence Platform

**Satellite Thermal Monitoring · Geospatial Intelligence · Explainable AI**

<br>

<a href="https://lalifirewatchai.netlify.app/">
  <img width="1917" height="1031" alt="FireWatch AI Mission Intelligence Platform" src="https://github.com/user-attachments/assets/24812ac0-57c3-4557-b7f6-00cb5bff6f13"/>
</a>

</div>

---

## 📊 Mission Intelligence & Analytics

<div align="center">

<img width="1917" height="1002" alt="FireWatch AI Analytics Dashboard" src="https://github.com/user-attachments/assets/662ec186-83c9-4337-b98e-a2d26f33a46c"/>

<br>

<strong>Analyze thermal activity through classification breakdowns, persistent-source statistics, industrial hotspots, and activity trends.</strong>

</div>

---

## 🛰️ Live NASA FIRMS Telemetry

<div align="center">

<img width="1917" height="937" alt="FireWatch AI Live NASA FIRMS Telemetry" src="https://github.com/user-attachments/assets/4f738acc-58b3-48f0-9f67-322ea00d7283"/>

<br>

<strong>Process NASA FIRMS MODIS and VIIRS telemetry through the FireWatch AI spatial and machine-learning pipeline.</strong>

</div>

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Lalithkrish06/FireWatch.git
```

## 2️⃣ Navigate to the Project

```bash
cd FireWatch
```

## 3️⃣ Backend Setup

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

## 4️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## 5️⃣ Start the Application

Run the backend and frontend according to the project's configuration.

For the frontend:

```bash
npm run dev
```

The application can then be accessed through the local development URL provided by Vite.

---

# 🔄 End-to-End Intelligence Workflow

```text
🛰️ NASA FIRMS
      │
      ▼
🔥 Thermal Detection
      │
      ▼
📍 Coordinate Processing
      │
      ▼
🗺️ Spatial Matching
      │
      ▼
🔁 30-Day Persistence
      │
      ▼
📊 Feature Engineering
      │
      ▼
🤖 Random Forest
      │
      ▼
🧠 Explainable AI
      │
      ▼
🌐 FireWatch Dashboard
      │
      ├── 🗺️ Map
      ├── 📊 Analytics
      ├── 🔎 Inspector
      ├── 📄 Reports
      └── 📥 Export
```

---

# 🎯 Project Highlights

| Area | Highlights |
|---|---|
| 🛰️ Satellite Intelligence | NASA FIRMS MODIS & VIIRS |
| 🗺️ GIS | OpenStreetMap spatial intelligence |
| 🤖 Machine Learning | Random Forest classification |
| 🧠 Explainability | XAI-based classification reasoning |
| 🔁 Temporal Analysis | 30-day persistence engine |
| 📍 Spatial Analysis | Polygon and distance verification |
| 🌐 Visualization | Interactive India command center |
| 🎞️ Time Analysis | 30-day thermal time-lapse |
| 📊 Analytics | Executive intelligence dashboard |
| 📄 Reporting | Automated PDF reports |
| 📥 Data | CSV export |
| ⚡ Deployment | Netlify |
| 🐳 Infrastructure | Docker / Docker Compose |

---

# 💡 Why This Project Matters

FireWatch AI demonstrates how **satellite data, geospatial intelligence, machine learning, and modern web technologies** can be combined into an intelligent monitoring platform.

The project brings together:

```text
NASA FIRMS
     +
OpenStreetMap
     +
Geospatial Analysis
     +
Temporal Intelligence
     +
Machine Learning
     +
Explainable AI
     +
Interactive Visualization
     ↓
Satellite Thermal Intelligence Platform
```

Instead of presenting raw satellite detections alone, FireWatch AI adds **spatial context, temporal persistence, classification, explainability, analytics, and reporting** to make the data more useful for investigation and monitoring.

---

# 🧠 Skills Demonstrated

- 🛰️ Satellite Data Processing
- 🤖 Machine Learning
- 🧠 Explainable AI
- 🗺️ Geospatial Analysis
- 📊 Data Analytics
- 🐍 Python Development
- ⚛️ React Development
- 🚀 FastAPI
- 🗺️ Leaflet Mapping
- 📈 Data Visualization
- 📄 Automated Reporting
- 🔌 REST API Integration
- 🗃️ Data Processing with Pandas
- 🧮 Numerical Computing with NumPy
- 🐳 Docker & Docker Compose
- 🌐 Web Application Deployment

---

# 📚 Learning Outcomes

Through FireWatch AI, the project demonstrates practical experience in:

- Working with satellite thermal datasets
- Processing NASA FIRMS telemetry
- Performing geospatial analysis
- Matching geographic coordinates with industrial regions
- Designing temporal persistence algorithms
- Building machine-learning classification pipelines
- Implementing explainable AI concepts
- Creating interactive geospatial dashboards
- Building FastAPI-based backend services
- Developing React-based visualization interfaces
- Generating automated incident reports
- Designing an end-to-end AI intelligence platform

---

# 🚀 Future Roadmap

### 🛰️ Satellite Intelligence

- Multi-satellite data fusion
- Additional satellite sources
- Advanced thermal anomaly detection
- Real-time satellite monitoring

### 🤖 AI & Machine Learning

- Advanced classification models
- Deep learning-based thermal detection
- Automated anomaly scoring
- Improved explainability
- Continuous model evaluation

### 🗺️ Geospatial Intelligence

- Advanced hazard-zone mapping
- More detailed industrial datasets
- Route and proximity intelligence
- Regional risk visualization

### 📊 Analytics

- Historical trend analysis
- Predictive thermal-risk analytics
- Advanced executive dashboards
- Automated intelligence summaries

### 🚨 Monitoring

- Real-time alerting
- Persistent-source alerts
- Orbital-pass notifications
- Automated investigation workflows

---

# 🌍 Real-World Applications

FireWatch AI can support use cases such as:

- 🏭 Industrial Fire Monitoring
- 🛰️ Satellite-Based Environmental Monitoring
- 🌲 Wildfire Intelligence
- 🌾 Agricultural Burning Analysis
- 🔥 Persistent Thermal Source Detection
- 🗺️ Geospatial Risk Monitoring
- 🌍 Environmental Intelligence
- 🚨 Thermal Incident Investigation
- 📊 Satellite Data Analytics

---

# 🔗 Project Links

<div align="center">

<a href="https://lalifirewatchai.netlify.app/">
  <img src="https://img.shields.io/badge/🔥%20Live%20Platform-orange?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Platform">
</a>
<a href="https://github.com/Lalithkrish06/FireWatch">
  <img src="https://img.shields.io/badge/⭐%20GitHub%20Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
</a>
<a href="https://github.com/Lalithkrish06/FireWatch/issues">
  <img src="https://img.shields.io/badge/🐛%20Report%20an%20Issue-EA4335?style=for-the-badge" alt="Report Issue">
</a>

</div>

---

# 🐛 Issues & Suggestions

Have you found a bug, encountered an issue, or have an idea to improve **FireWatch AI**?

Your feedback is welcome! 🚀

<div align="center">

### 💬 Contribute • Report • Improve

<a href="https://github.com/Lalithkrish06/FireWatch/issues">
  <img src="https://img.shields.io/badge/🐛%20Report%20an%20Issue-EA4335?style=for-the-badge" alt="Report Issue">
</a>
<a href="https://github.com/Lalithkrish06/FireWatch">
  <img src="https://img.shields.io/badge/⭐%20Star%20Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="Star Repository">
</a>

<br><br>

**Have an idea? → Open an issue and help make FireWatch AI better! 🚀**

</div>

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Developer

<div align="center">

### ⚡ Lalith Krish

**AI & Data Science Engineer**

*Building intelligent systems • AI applications • Geospatial intelligence • Data-driven solutions*

<br>

<a href="mailto:lalithkrish2006@gmail.com">
  <img src="https://img.shields.io/badge/📧%20Email-lalithkrish2006%40gmail.com-EA4335?style=for-the-badge" alt="Email">
</a>
<a href="https://www.linkedin.com/in/lalithkrish-data/">
  <img src="https://img.shields.io/badge/LinkedIn-Lalith%20Krish-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
<a href="https://github.com/Lalithkrish06">
  <img src="https://img.shields.io/badge/GitHub-Lalithkrish06-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>
<a href="https://lalithkrish.dev/">
  <img src="https://img.shields.io/badge/🌐%20Portfolio-lalithkrish.dev-000000?style=for-the-badge" alt="Portfolio">
</a>

</div>

---

<div align="center">

### 🛰️ FireWatch AI

**Detect • Classify • Track • Explain**

<br>

*Satellite-powered thermal intelligence for persistent and industrial heat-source monitoring across India.*

<br>

⭐ **If you found this project useful, consider giving the repository a star!**

</div>
