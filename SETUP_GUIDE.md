# Setup Instructions - Food & Shelter Finder

## Prerequisites

- Node.js and npm installed
- Both servers must be running simultaneously

## ⚙️ Server Setup

### Terminal 1: Start JSON Server (Database API)

```bash
cd d:\Food-and-Shelter-Finder-main\myapp
npx json-server db.json --port 3001
```

**Expected Output:**
```
JSON Server started on PORT :3001
Press CTRL-C to stop
Watching db.json...

Endpoints:
http://localhost:3001/users
http://localhost:3001/food
http://localhost:3001/shelter
```

### Terminal 2: Start React Dev Server (Frontend)

```bash
cd d:\Food-and-Shelter-Finder-main\myapp
npm run dev
```

**Expected Output:**
```
> myapp@0.0.0 dev
> vite

VITE v7.3.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## 🔍 Verify Both Servers Are Running

Open a new terminal and run:

```powershell
netstat -ano | findstr ":5173"
netstat -ano | findstr ":3001"
```

Both should return results showing LISTENING sockets.

## 🧪 Test the API

Open another terminal and test:

```powershell
# Test JSON Server is responding
Invoke-WebRequest -Uri "http://localhost:3001/users" | Select-Object StatusCode, @{Name='Body';Expression={$_.Content}}
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "uname": "admin",
    "uemail": "admin@example.com",
    "umobile": "1234567890",
    "upass": "admin123"
  }
]
```

## 🚀 Access the Application

1. Open browser: **http://localhost:5173**
2. You should see the Food & Shelter Finder login page

## 📝 Test Credentials

- **Username:** admin
- **Password:** admin123

## 🐛 Troubleshooting

### "Error logging in. Please try again."

**Solution:** Check browser console (F12 → Console tab) for detailed error messages.

**Common causes:**
- JSON Server not running on port 3001
- React dev server not running on port 5173
- db.json file missing or corrupted
- CORS issues

**Check status:**
```powershell
# Verify JSON Server is accessible
$response = Invoke-WebRequest -Uri "http://localhost:3001/users" -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) { 
  Write-Host "✅ JSON Server is working" 
} else { 
  Write-Host "❌ JSON Server is not responding" 
}

# Verify React dev server
$response = Invoke-WebRequest -Uri "http://localhost:5173" -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) { 
  Write-Host "✅ React dev server is working" 
} else { 
  Write-Host "❌ React dev server is not responding" 
}
```

### "Cannot connect to server"

**Causes:**
- JSON Server crashed or stopped
- Port 3001 is already in use

**Solution:**
```powershell
# Find process using port 3001
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object OwningProcess
if ($process) {
  Stop-Process -Id $process.OwningProcess -Force
  Write-Host "Killed process on port 3001"
}

# Restart JSON Server
cd d:\Food-and-Shelter-Finder-main\myapp
npx json-server db.json --port 3001
```

### Port Already in Use

```powershell
# Kill process on port 5173
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object {
  Stop-Process -Id $_.OwningProcess -Force
}

# Kill process on port 3001
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object {
  Stop-Process -Id $_.OwningProcess -Force
}
```

### db.json Not Found

**Check file location:**
```powershell
Get-ChildItem -Path "d:\Food-and-Shelter-Finder-main\myapp" -Name db.json
```

**If missing, create it:**
```powershell
$content = @{
    users = @(
        @{
            id = 1
            uname = "admin"
            uemail = "admin@example.com"
            umobile = "1234567890"
            upass = "admin123"
        }
    )
    food = @()
    shelter = @()
}

$content | ConvertTo-Json | Out-File -Path "d:\Food-and-Shelter-Finder-main\myapp\db.json"
```

## 📊 Monitor Servers

**Keep these commands ready:**

```powershell
# Monitor JSON Server requests (in separate terminal)
Get-Content -Path "d:\Food-and-Shelter-Finder-main\myapp\db.json" -Wait

# Check if axios is importing correctly
# Open browser DevTools → Network tab and look for requests to http://localhost:3001/*
```

## ✅ Verification Checklist

- [ ] JSON Server running on http://localhost:3001
- [ ] React dev server running on http://localhost:5173
- [ ] db.json file exists and is valid JSON
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful requests to /users endpoint
- [ ] Login works with admin/admin123
- [ ] New user registration creates entry in db.json

## 🔐 Default Users in db.json

```json
{
  "users": [
    {
      "id": 1,
      "uname": "admin",
      "uemail": "admin@example.com",
      "umobile": "1234567890",
      "upass": "admin123"
    }
  ]
}
```

Add more users directly to db.json or through the Register feature.

---

**Last Updated:** December 17, 2025
**Status:** ✅ Both servers configured and ready
