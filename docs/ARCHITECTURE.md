# Architecture – Astronomy Data Navigator (DeepSpace Analyst)

## Overview
Astronomy Data Navigator is a modular astronomy research assistant that combines:
- Interactive astronomy UI tools
- Data analysis workflows
- ML-powered anomaly/transient detection
- Survey dataset mining
- A scalable design for future integrations (SIMBAD, NED, SDSS, ScaleDown)

The project is built as a modern web application using React + TypeScript.

---

## System Design

### Frontend (Current Implementation)
- React + Vite + TypeScript
- TailwindCSS + shadcn/ui
- Plotly for interactive scientific visualization

### Backend (Planned Upgrade)
The project is designed so a FastAPI backend can be connected later for:
- live catalog API calls
- large dataset querying
- ScaleDown compression pipelines
- persistent storage

---

## Modules (Frontend)

### 1) Catalog Explorer
Handles object searching and metadata display.

### 2) Observation Planner
Computes rise/set windows and visibility trends.

### 3) Light Curve Lab
Performs light curve analysis and period detection.

### 4) Spectroscopy Studio
Runs spectrum normalization, peak detection, and redshift estimation.

### 5) Transient Watch
Detects anomalies using ML scoring logic.

### 6) Survey Miner
Filters SDSS-like datasets and exports results.

### 7) Research Assistant (Papers + QnA)
Searches and summarizes astronomy publications.

---

## Scalability Plan
To scale to 100M+ objects and 1B+ queries:
- compression-first storage
- caching layer
- indexed dataset query engine
- ScaleDown integration (future)

---

## Data Flow
User → UI Page → Tool Logic → Visualization → Export / Save

---

## Error Handling
- Input validation for CSV uploads
- Graceful fallback to demo datasets
- No crash behavior on invalid files
