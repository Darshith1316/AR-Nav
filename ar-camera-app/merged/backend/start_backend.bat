@echo off
echo Starting Fortify Vision Backend...
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install fastapi uvicorn

REM Start the backend server
echo Starting backend server...
echo.
echo Backend will be available at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
