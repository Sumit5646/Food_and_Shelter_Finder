# Google Maps API Setup Guide

## Getting Your Google Maps API Key

Follow these steps to enable Google Maps in your Food & Shelter Finder app:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project
- Click on the project dropdown at the top
- Click "NEW PROJECT"
- Enter project name: "Food & Shelter Finder"
- Click "CREATE"

### 3. Enable Required APIs
- In the left sidebar, go to **APIs & Services** → **Library**
- Search for "Maps JavaScript API"
  - Click on it
  - Click "ENABLE"
- Search for "Places API"
  - Click on it
  - Click "ENABLE"

### 4. Create an API Key
- Go to **APIs & Services** → **Credentials**
- Click "CREATE CREDENTIALS" → "API Key"
- Copy your API key

### 5. Add API Key to Your Project
- In the project root (`myapp/`), copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- Open `.env` and replace:
  ```
  VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
  ```
  with your actual API key

### 6. Set API Restrictions (Recommended for Security)
- In Google Cloud Console, go to **Credentials**
- Click on your API key
- Under "API restrictions", select:
  - Maps JavaScript API
  - Places API
- Under "Application restrictions", select:
  - HTTP referrers (websites)
  - Add your domain (e.g., localhost:5173 for development)

### 7. Restart Development Server
```bash
npm run dev
```

## Features Enabled

Once API key is configured, you'll have:
- 📍 **Interactive Google Maps** showing nearby food/shelter locations
- 🎯 **Markers** for each location with different colors
- ℹ️ **Info Windows** with full details (click any marker)
- 🛣️ **Get Directions** link to open Google Maps navigation
- 📞 **Direct phone call** links for each location

## Troubleshooting

**Map shows error message?**
- Verify API key is correctly added to `.env`
- Check APIs are enabled in Google Cloud Console
- Ensure you've restarted the dev server after adding the key

**Blank map or missing markers?**
- Check browser console (F12) for errors
- Verify food/shelter items have latitude & longitude in database
- Try refreshing the page

**API Quota exceeded?**
- Google Maps has free tier limits (25,000 map loads/day)
- Check usage in Google Cloud Console
- Consider setting up billing for production use

## Cost Considerations

- **Free Tier**: 25,000 map loads/month per API
- **After Free Tier**: ~$0.007 per map load (varies by API)
- Add payment method in Google Cloud Console to exceed free limits

## More Information

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [API Pricing](https://cloud.google.com/maps-platform/pricing)
