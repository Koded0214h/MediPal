#!/bin/bash

echo "🚀 Starting MediPal Development Environment"
echo "=========================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if ports are available
echo "Checking ports..."
check_port 8000 || exit 1
check_port 5173 || exit 1

echo ""
echo "Starting Django Backend (Port 8000)..."
cd backend
python manage.py runserver 8000 &
DJANGO_PID=$!

echo "Starting React Frontend (Port 5173)..."
cd ../frontend
npm run dev &
REACT_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8000"
echo "🧪 Test API: http://localhost:5173/test"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $DJANGO_PID $REACT_PID; exit" INT
wait 