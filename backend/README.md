# Backend (FastAPI) — Astronomy Data Navigator

This folder contains a minimal but functional Python backend required for Challenge 2.

## Run locally

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints
- GET `/health`
- POST `/api/lightcurve/analyze`
- POST `/api/spectra/analyze`
- POST `/api/transient/detect`
- POST `/api/survey/query`

All endpoints return JSON and never crash the server (try/except + validation).
