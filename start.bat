@echo off
echo ======================================================================
echo   FIREWATCH AI - Command Center Launch (SIH26162 / NTRO)
echo ======================================================================
echo.

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "FireWatch Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend spatial model to initialize...
timeout /t 4 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://localhost:5173 ...
start "FireWatch Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo Launching FireWatch AI Mission Control in default browser...
start http://localhost:5173
echo.
echo All services running!
echo Backend:  http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in respective windows to stop.
