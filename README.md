# Food & Shelter Finder

A React-based application designed to help users locate nearby food and shelter services. This project integrates Google Maps to provide real-time location visualization and includes a comprehensive backend simulation using JSON Server for managing users, food listings, and shelter listings.

## 🚀 Features

- **Interactive Maps**: View food and shelter locations on a real-time Google Map.
- **Search & Filter**: Easily find specific services based on your needs.
- **User Authentication**: Secure login and registration system.
- **Admin Dashboard**: Manage users, food listings, and shelter listings (CRUD operations).
- **Responsive Design**: Built with Bootstrap for mobile-friendly navigation.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: Bootstrap, CSS
- **Maps**: Google Maps JavaScript API, Places API
- **Backend**: JSON Server (Mock REST API)

## 📋 Prerequisites

- Node.js installed on your machine.
- A Google Cloud Project with Maps JavaScript API and Places API enabled (for map features).

## ⚙️ Installation & Setup

### 1. Install Dependencies
Navigate to the project directory and install the required packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `myapp` folder to store your Google Maps API key. You can copy the example file:

```bash
cp .env.example .env
```

Edit `.env` and add your key:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```
*See `GOOGLE_MAPS_SETUP.md` for detailed instructions on getting an API key.*

## 🏃‍♂️ Running the Application

This application requires two servers running simultaneously: the JSON Server (database) and the Vite Development Server (frontend).

### Terminal 1: Start JSON Server
```bash
npx json-server db.json --port 3001
```

### Terminal 2: Start React App
```bash
npm run dev
```

Open your browser and navigate to: **http://localhost:5173**

## 🧪 Testing & Usage

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Workflows
1. **Login**: Use the credentials above to access the dashboard.
2. **Find Services**: Navigate to Food or Shelter pages to view listings.
3. **Map View**: Click "Show Nearby" or view the map at the bottom of listing pages to see locations.
4. **Admin**: Use the Admin Dashboard to Add, Edit, or Delete listings.

*For more testing details, refer to `TESTING_GUIDE.md`.*

## 📂 Documentation

- Setup Guide - Detailed server setup.
- Google Maps Setup - API key configuration.
- Testing Guide - CRUD and feature testing.
