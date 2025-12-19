import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import './GoogleMapComponent.css';

/**
 * Google Maps Component for displaying food and shelter locations
 * Shows user location and nearby items as markers
 */
function GoogleMapComponent({ items, userLocation, title = "Nearby Locations", itemType = "food" }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Get Google Maps API key from environment variable
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-error">
        <p>⚠️ Google Maps API key not configured</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file
        </p>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="map-error">
        <p>📍 Enable location to view map</p>
      </div>
    );
  }

  const mapCenter = {
    lat: userLocation.latitude,
    lng: userLocation.longitude,
  };

  const mapOptions = {
    zoom: 14,
    fullscreenControl: true,
    streetViewControl: false,
  };

  // Get marker icon based on type
  const getMarkerIcon = (type) => {
    if (type === 'user') {
      return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    } else if (type === 'food') {
      return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    } else {
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  return (
    <div className="google-map-container">
      <h3>{title}</h3>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerClassName="google-map-wrapper" center={mapCenter} zoom={mapOptions.zoom}>
          {/* User Location Marker */}
          <Marker
            position={mapCenter}
            icon={getMarkerIcon('user')}
            title="Your Location"
            onClick={() => setSelectedMarker({ type: 'user', data: { name: 'You' } })}
          />

          {/* Nearby Items Markers */}
          {items
            .filter((item) => item.latitude && item.longitude)
            .map((item, idx) => (
              <Marker
                key={idx}
                position={{
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude),
                }}
                icon={getMarkerIcon(itemType)}
                title={item.fname || item.hname}
                onClick={() => setSelectedMarker({ type: 'item', data: item, itemType })}
              />
            ))}

          {/* Info Window */}
          {selectedMarker && (
            <InfoWindow
              position={
                selectedMarker.type === 'user'
                  ? mapCenter
                  : {
                      lat: parseFloat(selectedMarker.data.latitude),
                      lng: parseFloat(selectedMarker.data.longitude),
                    }
              }
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="info-window">
                {selectedMarker.type === 'user' ? (
                  <>
                    <h4>Your Location</h4>
                    <p>
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </p>
                  </>
                ) : (
                  <>
                    <h4>{selectedMarker.data.fname || selectedMarker.data.hname}</h4>
                    <p>
                      <strong>Business:</strong> {selectedMarker.data.fbname || selectedMarker.data.hname}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedMarker.data.fadd || selectedMarker.data.haddress}
                    </p>
                    <p>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${selectedMarker.data.fphone || selectedMarker.data.hphone}`}>
                        {selectedMarker.data.fphone || selectedMarker.data.hphone}
                      </a>
                    </p>
                    {selectedMarker.data.fprice && (
                      <p>
                        <strong>Price:</strong> ₹{selectedMarker.data.fprice}
                      </p>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${selectedMarker.data.latitude},${selectedMarker.data.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-link"
                    >
                      📍 Get Directions
                    </a>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default GoogleMapComponent;
