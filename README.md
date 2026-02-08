# 🌌 Astronomy Data Navigator (DeepSpace Analyst)

Astronomy Data Navigator is an AI-powered astronomy research assistant designed for astronomers and researchers.  
It provides a unified interface for catalog exploration, observation planning, photometry/light curve analysis, spectroscopy tools, transient detection, and survey dataset mining.

This project is built for advanced astronomy workflows with a scalable design that supports large datasets and discovery pipelines.

---

## 🚀 Key Features

### 🔎 Object Catalog Explorer
- Search objects by name (M31, NGC 1300, 3C 273, etc.)
- Search using RA/DEC coordinates
- Displays metadata such as:
  - Object type (star/galaxy/quasar)
  - magnitude
  - identifiers
  - survey references

### 🛰 Observation Planner
- Input:
  - Observer latitude & longitude
  - Date/time
  - Object coordinates
- Output:
  - Rise/set time
  - Visibility window
  - Altitude trends

### 📈 Light Curve Lab
- Upload CSV time-series photometry
- Run:
  - smoothing
  - outlier filtering
  - Lomb-Scargle period detection
- Interactive visualization

### 🌈 Spectroscopy Studio
- Upload spectrum (wavelength, flux)
- Normalize spectrum
- Peak detection
- Basic redshift estimation

### ⚡ Transient Detection
- Detect anomalies in light curves using ML
- Outputs top candidates with confidence scores

### 🪐 Survey Data Mining
- Query SDSS-like sample datasets
- Filter by:
  - redshift
  - magnitude
  - object class
  - sky region
- Export results

### 📚 Publication Finder + Research QnA
- Search astronomy papers (arXiv / ADS-ready)
- Store papers
- Summarize and answer questions grounded in retrieved papers

---

## 🧠 Unique Feature (Creative Addition)
### **“Discovery Mode: 1B-Scale Query Simulator”**
This project includes a dataset accelerator layer that simulates billion-scale querying using:
- compression-first storage
- indexed query filtering
- caching + dataset chunking

This demonstrates how ScaleDown-style pipelines can accelerate astronomy discovery workflows.

---

## 🛠 Tech Stack

**Frontend**
- React + Vite + TypeScript
- TailwindCSS
- shadcn/ui
- Plotly charts

**Backend Ready Design**
- Modular agent-based architecture (tools-based AI system)
- Easy integration with SIMBAD / NED / SDSS / NASA ADS

---

## 📂 Project Structure
```bash
src/
  components/
  pages/
  hooks/
public/
