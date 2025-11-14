@echo off
REM Windows batch file alternative to Makefile
REM Usage: Makefile.bat run
REM        Makefile.bat install
REM        Makefile.bat lint
REM        Makefile.bat format

set PORT=8000
if "%PORT%"=="" set PORT=8000

if "%1"=="run" (
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port %PORT%
) else if "%1"=="install" (
    pip install -r requirements.txt
) else if "%1"=="lint" (
    echo ruff not installed. Install with: pip install ruff
) else if "%1"=="format" (
    echo black not installed. Install with: pip install black
) else (
    echo Available targets:
    echo   Makefile.bat run       - Run the FastAPI server with auto-reload
    echo   Makefile.bat install   - Install Python dependencies
    echo   Makefile.bat lint      - Run ruff linter (optional)
    echo   Makefile.bat format    - Format code with black (optional)
)

