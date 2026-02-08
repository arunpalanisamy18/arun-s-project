# Features – Astronomy Data Navigator

## 1) Object Catalog Explorer
- Search celestial objects by name or coordinates
- Displays object metadata and identifiers
- Designed for SIMBAD/NED/SDSS integration

---

## 2) Observation Planner
- Inputs: lat, lon, date/time, RA/DEC
- Outputs: visibility window, rise/set, altitude trends
- Useful for telescope observation planning

---

## 3) Light Curve Lab
- Upload CSV time-series photometry
- Analysis:
  - smoothing
  - outlier removal
  - Lomb-Scargle period detection
- Interactive plotting using Plotly

---

## 4) Spectroscopy Studio
- Upload spectrum CSV (wavelength, flux)
- Features:
  - normalization
  - peak detection
  - basic redshift estimation

---

## 5) Transient Watch
- Detects anomalies in brightness variation
- Uses ML-style scoring logic
- Outputs top candidates and confidence score

---

## 6) Survey Miner
- Filters SDSS-like survey datasets
- Filters include:
  - redshift range
  - magnitude range
  - object class
- Supports exporting filtered data

---

## 7) Publication Finder + Research QnA
- Designed to support:
  - arXiv / NASA ADS search
  - paper summarization
  - question answering grounded in papers
