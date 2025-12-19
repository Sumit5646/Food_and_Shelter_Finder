import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './ShelterList.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { sortByDistance, filterByDistance } from '../utils/distanceUtils';
import GoogleMapComponent from './GoogleMapComponent';

const API_BASE_URL = 'http://localhost:3001';

function ShelterList() {
  const [shelters, setShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showNearby, setShowNearby] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(5);
  const { userLocation, error: locationError, loading: locationLoading } = useUserLocation();
  const [formData, setFormData] = useState({
    hname: '',
    hdis: '',
    haddress: '',
    hphone: '',
    hlocation: '',
    image: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shelter`);
      setShelters(response.data);
      setFilteredShelters(response.data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
      alert('Error fetching shelters');
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  useEffect(() => {
    let filtered = shelters.filter(item =>
      item.hname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hdis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply nearby filter if enabled
    if (showNearby && userLocation) {
      filtered = filterByDistance(
        filtered,
        userLocation.latitude,
        userLocation.longitude,
        nearbyRadius
      );
    }

    // Apply sorting
    if (sortBy === 'distance' && userLocation) {
      filtered = sortByDistance(
        filtered,
        userLocation.latitude,
        userLocation.longitude
      );
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.hname.localeCompare(b.hname));
    }

    setFilteredShelters(filtered);
  }, [searchTerm, sortBy, shelters, showNearby, userLocation, nearbyRadius]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      hname: '',
      hdis: '',
      haddress: '',
      hphone: '',
      hlocation: '',
      image: '',
      latitude: '',
      longitude: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update shelter
        await axios.put(`${API_BASE_URL}/shelter/${editingId}`, formData);
        alert('Shelter updated successfully');
      } else {
        // Create new shelter
        await axios.post(`${API_BASE_URL}/shelter`, formData);
        alert('Shelter added successfully');
      }
      resetForm();
      setShowForm(false);
      fetchShelters();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shelter) => {
    setFormData(shelter);
    setEditingId(shelter.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await axios.delete(`${API_BASE_URL}/shelter/${id}`);
        alert('Shelter deleted successfully');
        fetchShelters();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting shelter');
      }
    }
  };

  return (
    <div className="shelter-list-page">
      <Navbar />
      
      {/* Toolbar */}
      <div className="page-toolbar">
        <div className="toolbar-content">
          <div className="search-bar">
            <input 
              type="search" 
              placeholder="🔍 Search shelters..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            {userLocation && <option value="distance">Sort by Distance</option>}
          </select>
          {userLocation && (
            <div className="nearby-controls">
              <label className="nearby-toggle">
                <input 
                  type="checkbox" 
                  checked={showNearby} 
                  onChange={(e) => setShowNearby(e.target.checked)}
                />
                Show Nearby ({nearbyRadius}km)
              </label>
              {showNearby && (
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={nearbyRadius}
                  onChange={(e) => setNearbyRadius(parseInt(e.target.value))}
                  className="radius-slider"
                  title={`${nearbyRadius}km radius`}
                />
              )}
            </div>
          )}
          {user && user.role === 'admin' && (
            <button className="btn-add-shelter" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Shelter</button>
          )}
        </div>
      </div>

      <section className="page-header">
        <h1>🏠 Shelters & Homes</h1>
        <p>Find safe and comfortable shelter options in your area</p>
      </section>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Shelter' : 'Add New Shelter'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Shelter Name</label>
                <input type="text" name="hname" value={formData.hname} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="hdis" value={formData.hdis} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="haddress" value={formData.haddress} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="hphone" value={formData.hphone} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Google Maps Location Link</label>
                <input type="url" name="hlocation" value={formData.hlocation} onChange={handleFormChange} placeholder="https://maps.google.com/?q=..." disabled={loading} />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleFormChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="0.0001" name="latitude" value={formData.latitude} onChange={handleFormChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="0.0001" name="longitude" value={formData.longitude} onChange={handleFormChange} disabled={loading} />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); resetForm(); }} disabled={loading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="container">
        {filteredShelters.length > 0 ? (
          <div className="shelter-grid">
            {filteredShelters.map(shelter => (
              <div className="shelter-card" key={shelter.id}>
                <div className="card-image-wrapper">
                  <img className="card-image" src={shelter.image || '/depositphotos_53689175-stock-photo-home-for-rent.jpg'} alt={shelter.hname} />
                  <div className="card-badge">Shelter</div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{shelter.hname}</h3>
                  <p className="card-description">{shelter.hdis}</p>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">Address</span>
                      <span className="meta-value">{shelter.haddress}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Phone</span>
                      <span className="meta-value">{shelter.hphone}</span>
                    </div>
                    {userLocation && shelter.latitude && shelter.longitude && (
                      <div className="meta-item">
                        <span className="meta-label">Distance</span>
                        <span className="meta-value distance-badge">
                          {(() => {
                            const R = 6371;
                            const dLat = (shelter.latitude - userLocation.latitude) * Math.PI / 180;
                            const dLon = (shelter.longitude - userLocation.longitude) * Math.PI / 180;
                            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(shelter.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            const distance = (R * c).toFixed(2);
                            return `${distance} km`;
                          })()}
                        </span>
                      </div>
                    )}
                  </div>

                  <details className="card-details">
                    <summary>More Details</summary>
                    <div className="details-content">
                      <p><strong>Address:</strong> {shelter.haddress}</p>
                      <p><strong>Phone:</strong> {shelter.hphone}</p>
                      {shelter.hlocation && <a href={shelter.hlocation} className="detail-link" target="_blank" rel="noopener noreferrer">📍 View Location</a>}
                    </div>
                  </details>

                  <div className="card-actions">
                    {user && user.role === 'admin' && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(shelter)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(shelter.id)}>🗑️ Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No shelters found. Try adjusting your search.</p>
          </div>
        )}
      </main>

      {/* Google Map Display */}
      {userLocation && filteredShelters.length > 0 && (
        <section className="container">
          <GoogleMapComponent 
            items={filteredShelters} 
            userLocation={userLocation} 
            title="🗺️ Shelter Locations Near You" 
            itemType="shelter"
          />
        </section>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/contact">Contact</Link>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
          <p>&copy; 2024 Food & Shelter Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ShelterList;
