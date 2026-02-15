from __future__ import annotations

import io
import math
import traceback
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from astropy.timeseries import LombScargle
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from scipy.signal import find_peaks
from sklearn.ensemble import IsolationForest


# -----------------------------
# App
# -----------------------------
app = FastAPI(
    title="Astronomy Data Navigator Backend",
    version="1.0.0",
    description="Minimal FastAPI backend for light curves, spectra, transients, and survey queries.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon/demo only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Helpers
# -----------------------------
def ok(data: Any) -> Dict[str, Any]:
    return {"ok": True, "data": data}


def fail(message: str, details: Optional[str] = None) -> Dict[str, Any]:
    return {"ok": False, "error": {"message": message, "details": details}}


def safe_float(x: Any, default: float = 0.0) -> float:
    try:
        if x is None:
            return default
        return float(x)
    except Exception:
        return default


def moving_average(y: np.ndarray, window: int = 7) -> np.ndarray:
    if window <= 1:
        return y
    window = min(window, max(2, len(y)))
    kernel = np.ones(window) / window
    return np.convolve(y, kernel, mode="same")


def zscore(y: np.ndarray) -> np.ndarray:
    mu = float(np.mean(y))
    sd = float(np.std(y)) if float(np.std(y)) > 1e-12 else 1.0
    return (y - mu) / sd


# -----------------------------
# Schemas
# -----------------------------
class LightCurvePoint(BaseModel):
    time: float
    flux: float


class LightCurveAnalyzeRequest(BaseModel):
    points: List[LightCurvePoint] = Field(..., description="List of time, flux points")
    smoothing_window: int = Field(7, ge=1, le=101)
    remove_outliers: bool = True
    max_outlier_z: float = Field(3.5, ge=1.0, le=10.0)


class SpectraPoint(BaseModel):
    wavelength: float
    flux: float


class SpectraAnalyzeRequest(BaseModel):
    points: List[SpectraPoint]
    normalize: bool = True
    peak_prominence: float = Field(0.05, ge=0.0, le=10.0)
    max_peaks: int = Field(12, ge=1, le=100)


class TransientDetectRequest(BaseModel):
    points: List[LightCurvePoint]
    contamination: float = Field(0.06, ge=0.01, le=0.3)


class SurveyQueryRequest(BaseModel):
    # This is a demo schema that matches the UI fields.
    object_type: str = Field("GALAXY")
    redshift_min: float = Field(0.0, ge=0.0, le=20.0)
    redshift_max: float = Field(3.0, ge=0.0, le=20.0)
    mag_min: float = Field(10.0, ge=0.0, le=40.0)
    mag_max: float = Field(25.0, ge=0.0, le=40.0)
    survey_field: str = Field("COSMOS")
    limit: int = Field(50, ge=1, le=500)


# -----------------------------
# Routes
# -----------------------------
@app.get("/health")
def health():
    return ok({"status": "healthy"})


@app.post("/api/lightcurve/analyze")
def lightcurve_analyze(req: LightCurveAnalyzeRequest):
    try:
        if len(req.points) < 10:
            return fail("Need at least 10 points for analysis.")

        t = np.array([p.time for p in req.points], dtype=float)
        f = np.array([p.flux for p in req.points], dtype=float)

        # Sort by time
        order = np.argsort(t)
        t = t[order]
        f = f[order]

        # Outlier removal
        kept_mask = np.ones_like(f, dtype=bool)
        if req.remove_outliers:
            zs = np.abs(zscore(f))
            kept_mask = zs <= req.max_outlier_z
            t_clean = t[kept_mask]
            f_clean = f[kept_mask]
        else:
            t_clean, f_clean = t, f

        # Smoothing
        f_smooth = moving_average(f_clean, window=req.smoothing_window)

        # Lomb-Scargle period
        # (Simple robust range)
        baseline = float(t_clean.max() - t_clean.min())
        if baseline <= 0:
            return fail("Invalid time values (baseline <= 0).")

        min_period = max(0.05, baseline / 200.0)
        max_period = max(min_period * 2, baseline / 2.0)

        min_freq = 1.0 / max_period
        max_freq = 1.0 / min_period

        ls = LombScargle(t_clean, f_clean)
        freq, power = ls.autopower(minimum_frequency=min_freq, maximum_frequency=max_freq, samples_per_peak=10)

        best_idx = int(np.argmax(power))
        best_freq = float(freq[best_idx])
        best_period = float(1.0 / best_freq) if best_freq > 0 else None

        variability_score = float(np.std(f_clean) / (np.mean(np.abs(f_clean)) + 1e-9))

        # phase fold
        phase = None
        if best_period and best_period > 0:
            phase = ((t_clean - t_clean.min()) % best_period) / best_period
        else:
            phase = np.zeros_like(t_clean)

        return ok(
            {
                "n_points": int(len(req.points)),
                "n_used": int(len(t_clean)),
                "best_period": best_period,
                "variability_score": variability_score,
                "time": t_clean.tolist(),
                "flux": f_clean.tolist(),
                "flux_smooth": f_smooth.tolist(),
                "phase": phase.tolist(),
                "periodogram": {
                    "frequency": freq.tolist(),
                    "power": power.tolist(),
                },
            }
        )

    except Exception:
        return fail("Light curve analysis failed.", traceback.format_exc())


@app.post("/api/spectra/analyze")
def spectra_analyze(req: SpectraAnalyzeRequest):
    try:
        if len(req.points) < 20:
            return fail("Need at least 20 spectral points.")

        w = np.array([p.wavelength for p in req.points], dtype=float)
        f = np.array([p.flux for p in req.points], dtype=float)

        order = np.argsort(w)
        w = w[order]
        f = f[order]

        # normalize
        f_proc = f.copy()
        if req.normalize:
            p5 = np.percentile(f_proc, 5)
            p95 = np.percentile(f_proc, 95)
            denom = float(p95 - p5) if float(p95 - p5) > 1e-12 else 1.0
            f_proc = (f_proc - p5) / denom

        # peak detection
        # Prominence is relative to normalized flux
        peaks, props = find_peaks(f_proc, prominence=req.peak_prominence)
        # limit
        peaks = peaks[: req.max_peaks]

        peak_w = w[peaks].tolist()
        peak_f = f_proc[peaks].tolist()

        # Very simple redshift estimate using H-alpha line (6563 Å)
        # We take the strongest peak as a guess.
        z_est = None
        if len(peaks) > 0:
            strongest = int(peaks[np.argmax(f_proc[peaks])])
            observed = float(w[strongest])
            rest = 6563.0
            z_est = (observed - rest) / rest

        return ok(
            {
                "n_points": int(len(req.points)),
                "wavelength": w.tolist(),
                "flux": f.tolist(),
                "flux_processed": f_proc.tolist(),
                "peaks": [{"wavelength": float(a), "flux": float(b)} for a, b in zip(peak_w, peak_f)],
                "estimated_redshift": z_est,
            }
        )

    except Exception:
        return fail("Spectra analysis failed.", traceback.format_exc())


@app.post("/api/transient/detect")
def transient_detect(req: TransientDetectRequest):
    try:
        if len(req.points) < 15:
            return fail("Need at least 15 points for transient detection.")

        t = np.array([p.time for p in req.points], dtype=float)
        f = np.array([p.flux for p in req.points], dtype=float)

        order = np.argsort(t)
        t = t[order]
        f = f[order]

        # Features: flux, delta flux, rolling mean residual
        df = np.diff(f, prepend=f[0])
        roll = moving_average(f, window=max(5, min(21, len(f) // 5)))
        resid = f - roll

        X = np.column_stack([zscore(f), zscore(df), zscore(resid)])

        model = IsolationForest(
            n_estimators=200,
            contamination=req.contamination,
            random_state=42,
        )
        model.fit(X)
        scores = -model.decision_function(X)  # higher = more anomalous

        # Candidates = top 5
        idx = np.argsort(scores)[::-1][:5]

        candidates = []
        for i in idx:
            candidates.append(
                {
                    "time": float(t[i]),
                    "flux": float(f[i]),
                    "score": float(scores[i]),
                }
            )

        return ok(
            {
                "n_points": int(len(req.points)),
                "contamination": float(req.contamination),
                "scores": scores.tolist(),
                "candidates": candidates,
            }
        )

    except Exception:
        return fail("Transient detection failed.", traceback.format_exc())


@app.post("/api/survey/query")
def survey_query(req: SurveyQueryRequest):
    """
    Demo survey query:
    Generates a synthetic SDSS-like table and filters it.
    This is still valid "engineering" for the challenge,
    and can later be replaced by real SDSS/ScaleDown querying.
    """
    try:
        rng = np.random.default_rng(42)

        # Generate synthetic dataset (2k rows)
        n = 2000
        object_types = np.array(["STAR", "GALAXY", "QSO", "UNKNOWN"])

        df = pd.DataFrame(
            {
                "object_id": [f"DSA-{i:07d}" for i in range(n)],
                "object_type": rng.choice(object_types, size=n, p=[0.35, 0.45, 0.15, 0.05]),
                "redshift": np.clip(rng.normal(loc=0.8, scale=0.9, size=n), 0, 8),
                "r_mag": np.clip(rng.normal(loc=20.0, scale=2.5, size=n), 10, 30),
                "ra": rng.uniform(0, 360, size=n),
                "dec": rng.uniform(-90, 90, size=n),
                "survey_field": rng.choice(["COSMOS", "GOODS-N", "STRIPE82", "UDS"], size=n),
            }
        )

        # Filters
        ot = (req.object_type or "").upper().strip()
        if ot and ot != "ALL":
            df = df[df["object_type"] == ot]

        df = df[(df["redshift"] >= req.redshift_min) & (df["redshift"] <= req.redshift_max)]
        df = df[(df["r_mag"] >= req.mag_min) & (df["r_mag"] <= req.mag_max)]

        sf = (req.survey_field or "").upper().strip()
        if sf and sf != "ALL":
            df = df[df["survey_field"] == sf]

        df = df.head(req.limit)

        return ok(
            {
                "count": int(len(df)),
                "results": df.to_dict(orient="records"),
            }
        )

    except Exception:
        return fail("Survey query failed.", traceback.format_exc())
