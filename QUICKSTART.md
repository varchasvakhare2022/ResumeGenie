# 🚀 Quick Start Guide - ResumeGenie (No Virtual Environment)

Simple instructions to run the project on Windows **without using a virtual environment**.

## ✅ Prerequisites Check

- ✅ Python 3.13.3 (installed)
- ✅ Node.js v22.15.0 (installed)
- ✅ Environment variables configured (done!)
- ✅ Dependencies installed (done!)

## 📋 Step-by-Step Instructions

### Step 1: Run Backend Server

Open a **PowerShell** terminal and run:

```powershell
# Navigate to backend directory
cd E:\ResumeGenie\backend

# Run the backend server directly
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend should start at: **http://localhost:8000**

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
Connected to MongoDB successfully
INFO:     Application startup complete.
```

### Step 2: Run Frontend Server (In a NEW Terminal)

Open a **NEW PowerShell** terminal (keep backend running) and run:

```powershell
# Navigate to frontend directory
cd E:\ResumeGenie\frontend

# Start frontend development server
npm run dev
```

The frontend should start at: **http://localhost:5173**

**Expected output:**
```
VITE v7.2.2  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 3: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the ResumeGenie landing page!

### Step 4: Verify Everything Works

- ✅ Backend health check: http://localhost:8000/api/health
  - Should return: `{"status":"ok","env":"dev","db":true}`
- ✅ Frontend: http://localhost:5173
  - Should show the ResumeGenie landing page

## 🛠️ Quick Commands Reference

### Backend (Terminal 1)
```powershell
cd E:\ResumeGenie\backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2)
```powershell
cd E:\ResumeGenie\frontend
npm run dev
```

## 🛠️ Troubleshooting

### Backend won't start?
- **Port 8000 in use?** Change the port:
  ```powershell
  python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
  ```
  Then update `frontend/.env`: `VITE_API_BASE_URL=http://localhost:8001`

- **Module not found error?** Install dependencies:
  ```powershell
  cd E:\ResumeGenie\backend
  pip install -r requirements.txt
  ```

- **MongoDB connection error?** Test your connection:
  ```powershell
  cd E:\ResumeGenie\backend
  python test_mongodb_connection.py
  ```

### Frontend won't start?
- **Port 5173 in use?** Vite will automatically use the next available port

- **Module not found error?** Install dependencies:
  ```powershell
  cd E:\ResumeGenie\frontend
  npm install
  ```

## 🎉 You're Ready!

Once both servers are running:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Visit **http://localhost:5173** and start building resumes!
