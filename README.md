# ResumeGenie

ResumeGenie is a lightweight monorepo that pairs a modern React frontend with a FastAPI backend.

- `frontend/` — React + Vite + TypeScript + Tailwind CSS single-page app scaffolded for rapid UI development.
- `backend/` — FastAPI service providing a foundation for AI-powered resume generation APIs.

## Stack Overview

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
- **Backend:** Python 3.11+, FastAPI, Uvicorn

## Getting Started

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Feel free to extend the workspace with additional tooling (testing, linting, CI/CD) as the project grows.

