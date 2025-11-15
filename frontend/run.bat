@echo off
REM Simple batch script to run the frontend server
cd /d %~dp0
echo Starting ResumeGenie Frontend Server...
echo.
npm run dev
pause

