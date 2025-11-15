@echo off
REM Simple batch script to run the backend server (no virtual environment required)
cd /d %~dp0
echo Starting ResumeGenie Backend Server...
echo.
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

