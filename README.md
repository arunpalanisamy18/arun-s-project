# 🌌 Astronomy Data Navigator (DeepSpace Analyst)

A premium astronomy research assistant that combines catalog exploration, observation planning, light curve analysis, spectroscopy tools, transient detection, survey mining, and paper-based QnA in one unified platform.

## ✨ Features
- Object Catalog Explorer
- Observation Planner
- Light Curve Lab (period detection + smoothing)
- Spectroscopy Studio (peak detection + redshift estimate)
- Transient Watch (anomaly scoring)
- Survey Miner (filters + export)
- Research Assistant (paper discovery + QnA)
- Discovery Mode (research-style insights + follow-up suggestions)
- Login + protected routes

## 🛠 Tech Stack
- React + Vite + TypeScript
- TailwindCSS + shadcn/ui
- Plotly for interactive charts

## 🔐 Environment Variables
Create a `.env` file:

```bash
VITE_SCALEDOWN_API_KEY=your_key_here
```

A template is provided in `.env.example`.

## ▶️ Run locally
```bash
npm install
npm run dev
```

## 📦 Build
```bash
npm run build
npm run preview
```

## 📄 Documentation
See the `/docs` folder (add if not present) for architecture and feature documentation.

## 👨‍💻 Author
Built by Arun Palanisamy (A.A.)


## 🐍 Backend (Python/FastAPI)

Run the backend locally:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check:
- http://localhost:8000/health
