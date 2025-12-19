#!/usr/bin/env powershell
# Start-Servers.ps1 - Start both JSON Server and React Dev Server

param(
    [switch]$KillExisting
)

$myappPath = "d:\Food-and-Shelter-Finder-main\myapp"

Write-Host "🚀 Food & Shelter Finder - Server Starter" -ForegroundColor Green
Write-Host ""

# Kill existing processes if requested
if ($KillExisting) {
    Write-Host "Killing existing processes on ports 3001 and 5173..." -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Existing processes killed" -ForegroundColor Green
}

# Check if db.json exists
if (!(Test-Path "$myappPath\db.json")) {
    Write-Host "❌ db.json not found! Creating default database..." -ForegroundColor Red
    $defaultDb = @{
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
    $defaultDb | ConvertTo-Json | Out-File -Path "$myappPath\db.json" -Encoding utf8
    Write-Host "✅ db.json created with default admin user" -ForegroundColor Green
}

Write-Host "📂 Working directory: $myappPath" -ForegroundColor Cyan
Write-Host ""

# Start servers
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Starting JSON Server (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$myappPath'; npx json-server db.json --port 3001" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "2️⃣  Starting React Dev Server (port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$myappPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173/" -ForegroundColor Green
Write-Host "   API:      http://localhost:3001/" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
Write-Host "   Username: admin" -ForegroundColor Green
Write-Host "   Password: admin123" -ForegroundColor Green
Write-Host ""
Write-Host "⏹️  To stop servers: Close the PowerShell windows or press Ctrl+C" -ForegroundColor Yellow
