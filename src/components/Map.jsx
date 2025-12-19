import React, { useEffect, useState } from 'react';
import './Map.css';

/**
 * Simple Map component using Google Maps Embed API
 * Shows nearby food/shelter items
 */
function Map({ items, userLocation, title = "Nearby Locations" }) {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    if (userLocation && items.length > 0) {
      // Create a simple static map URL with markers
      // This uses Google Static Maps API format
      const markers = items
        .filter(item => item.latitude && item.longitude)
        .map(item => `${item.latitude},${item.longitude}`)
        .join('|');

      if (markers) {
        const userMarker = `${userLocation.latitude},${userLocation.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/staticmap?size=800x400&center=${userLocation.latitude},${userLocation.longitude}&markers=color:blue|${userMarker}&markers=color:red|${markers}&zoom=14&style=feature:poi|visibility:off&key=YOUR_GOOGLE_MAPS_API_KEY`;
        setMapUrl(url);
      }
    }
  }, [items, userLocation]);

  if (!userLocation || !items.length) {
    return (
      <div className="map-container empty-map">
        <p>Enable location to see items on map</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <h3>{title}</h3>
      <div className="map-wrapper">
        {/* Using OpenStreetMap via Leaflet would be a better free alternative */}
        <div className="map-info">
          <p>Map visualization shows {items.length} locations near you:</p>
          <div className="location-list">
            {items.slice(0, 5).map((item, idx) => (
              <div key={idx} className="location-item">
                <span className="location-marker">📍</span>
                <span className="location-name">
                  {item.fname || item.hname} - {item.fadd || item.haddress}
                </span>
              </div>
            ))}
            {items.length > 5 && <p className="more-items">+ {items.length - 5} more items</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
