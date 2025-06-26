# MediPal Django-React Connection Setup

## Overview
This document explains how the Django backend (port 8000) is connected to the React frontend (port 5173) for local development.

## Configuration Changes Made

### 1. Django Backend (Port 8000)
- **File**: `backend/backend/settings.py`
- **Changes**:
  - Set `DEBUG = True` for development
  - Added CORS configuration for React frontend
  - Added specific allowed origins for localhost:5173

### 2. React Frontend (Port 5173)
- **File**: `frontend/vite.config.js`
- **Changes**:
  - Added proxy configuration to forward `/api` requests to Django backend
  - Set explicit port configuration

- **File**: `frontend/.env.local`
- **Changes**:
  - Set `VITE_API_BASE_URL=http://localhost:8000/api` for local development

### 3. API Utilities
- **File**: `frontend/src/utils/api.js` (NEW)
- **Purpose**: Centralized API functions for common operations

### 4. Test Component
- **File**: `frontend/src/components/ApiTest.jsx` (NEW)
- **Purpose**: Test the API connection between frontend and backend

## How to Start Development

### Option 1: Use the Start Script (Recommended)
```bash
./start-dev.sh
```

### Option 2: Manual Start
1. **Start Django Backend**:
   ```bash
   cd backend
   python manage.py runserver 8000
   ```

2. **Start React Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

## Testing the Connection

1. **Visit the test page**: http://localhost:5173/test
2. **Check browser console** for API request logs
3. **Verify API endpoints**: http://localhost:8000/api/

## API Endpoints Available

- `GET /api/` - API root (test connection)
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `GET /api/dashboard/` - Dashboard data
- `GET /api/health-profile/` - Health profile
- `GET /api/wallet/` - Wallet details
- `POST /api/contact/` - Contact form

## How the Connection Works

1. **Frontend makes API calls** to `/api/*` endpoints
2. **Vite proxy** forwards these requests to `http://localhost:8000/api/*`
3. **Django backend** processes the requests and returns JSON responses
4. **CORS headers** allow the frontend to receive responses

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Production (.env.example)
```
VITE_API_BASE_URL=https://medipal-kx8d.onrender.com/api
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure Django CORS settings are correct
   - Check that frontend is running on port 5173

2. **Connection Refused**:
   - Verify Django backend is running on port 8000
   - Check if ports are already in use

3. **API Not Found**:
   - Ensure Django URLs are properly configured
   - Check that API endpoints exist in `core/urls.py`

### Debug Steps:
1. Check browser console for errors
2. Verify both servers are running
3. Test API directly: `curl http://localhost:8000/api/`
4. Check network tab in browser dev tools

## Production Deployment

For production, update the environment variables:
- Set `VITE_API_BASE_URL` to your production backend URL
- Ensure Django `DEBUG = False`
- Configure proper CORS settings for production domain 