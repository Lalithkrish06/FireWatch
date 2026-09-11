#!/bin/bash
echo "======================================================================"
echo "  LALIFIREWATCH - Satellite Thermal Surveillance Platform"
echo "======================================================================"
echo ""

echo "Starting Python FastAPI Backend on http://localhost:8000..."
cd backend && python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

sleep 3

echo "Starting React Frontend on http://localhost:5173..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "Both services launched! PIDs: Backend ($BACKEND_PID), Frontend ($FRONTEND_PID)"
echo "Navigate to http://localhost:5173 to access FireWatch AI."

wait
