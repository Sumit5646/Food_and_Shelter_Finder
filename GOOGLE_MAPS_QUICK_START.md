# Google Maps Integration - Quick Start

## What's New?

Your app now includes **real-time Google Maps** showing actual nearby food and shelter locations!

## Features

✅ **Interactive Maps** on Food & Shelter pages
✅ **Colored Markers**:
  - 🔵 Blue = Your location
  - 🟠 Orange = Food locations
  - 🔴 Red = Shelter locations

✅ **Click Any Marker** to see:
  - Name & address
  - Phone number (clickable to call)
  - Price (for food)
  - "Get Directions" link

✅ **Auto-centers** on your location
✅ **Shows filtered results** when using search/sort

## Setup (Takes 5 minutes!)

### Step 1: Get Google Maps API Key
See detailed instructions in: **GOOGLE_MAPS_SETUP.md**

Quick summary:
1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable "Maps JavaScript API" & "Places API"
4. Create an API key

### Step 2: Add API Key to Project
```bash
# In myapp/ folder
cp .env.example .env
```

Edit `.env` and add your key:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 3: Install Dependencies & Run
```bash
npm install
npm run dev
```

## How It Works

1. When you visit Food/Shelter page, browser asks for location permission
2. Click "Show Nearby" checkbox to filter nearby items
3. Scroll down to see **interactive Google Map**
4. Click any marker on map to see location details
5. Click "Get Directions" to open navigation

## Files Added/Modified

### New Files:
- `src/components/GoogleMapComponent.jsx` - Main map component
- `src/components/GoogleMapComponent.css` - Map styling
- `.env.example` - Environment variables template
- `GOOGLE_MAPS_SETUP.md` - Detailed setup instructions

### Modified Files:
- `package.json` - Added @react-google-maps/api dependency
- `src/components/FoodList.jsx` - Integrated GoogleMapComponent
- `src/components/ShelterList.jsx` - Integrated GoogleMapComponent

## Troubleshooting

**Map shows "API key not configured"?**
→ Make sure you:
  1. Added key to `.env` file
  2. Restarted dev server (`npm run dev`)
  3. Refreshed browser page

**Markers not showing?**
→ Check that food/shelter items have latitude & longitude in the database

**Only "Your Location" marker shows?**
→ Ensure filtered items have valid coordinates in db.json

For more help, see **GOOGLE_MAPS_SETUP.md**
