import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './FoodList.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { sortByDistance, filterByDistance } from '../utils/distanceUtils';
import GoogleMapComponent from './GoogleMapComponent';

const API_BASE_URL = 'http://localhost:3001';

function FoodList() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
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
    fbname: '',
    fname: '',
    fdis: '',
    fprice: '',
    fadd: '',
    fphone: '',
    fimage: '',
    flocation: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/food`);
      setFoodItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching food:', error);
      alert('Error fetching food items');
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    let filtered = foodItems.filter(item =>
      item.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fbname.toLowerCase().includes(searchTerm.toLowerCase())
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
      filtered.sort((a, b) => a.fname.localeCompare(b.fname));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.fprice) - parseFloat(b.fprice));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.fprice) - parseFloat(a.fprice));
    }

    setFilteredItems(filtered);
  }, [searchTerm, sortBy, foodItems, showNearby, userLocation, nearbyRadius]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      fbname: '',
      fname: '',
      fdis: '',
      fprice: '',
      fadd: '',
      fphone: '',
      fimage: '',
      flocation: '',
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
        // Update food item
        await axios.put(`${API_BASE_URL}/food/${editingId}`, formData);
        alert('Food item updated successfully');
      } else {
        // Create new food item
        await axios.post(`${API_BASE_URL}/food`, formData);
        alert('Food item added successfully');
      }
      resetForm();
      setShowForm(false);
      fetchFoodItems();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/food/${id}`);
        alert('Food item deleted successfully');
        fetchFoodItems();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting food item');
      }
    }
  };

  return (
    <div className="food-list-page">
      <Navbar />
      
      {/* Toolbar */}
      <div className="page-toolbar">
        <div className="toolbar-content">
          <div className="search-bar">
            <input 
              type="search" 
              placeholder="🔍 Search meals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
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
            <button className="btn-add-food" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Food</button>
          )}
        </div>
      </div>

      {/* Page Header */}
      <section className="page-header">
        <h1>🍽️ Food Meals</h1>
        <p>Discover available meals and food services in your area</p>
      </section>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Business Name</label>
                <input type="text" name="fbname" value={formData.fbname} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Food Name</label>
                <input type="text" name="fname" value={formData.fname} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="fdis" value={formData.fdis} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" name="fprice" value={formData.fprice} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="fadd" value={formData.fadd} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="fphone" value={formData.fphone} onChange={handleFormChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="fimage" value={formData.fimage} onChange={handleFormChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Google Maps Location Link</label>
                <input type="url" name="flocation" value={formData.flocation} onChange={handleFormChange} placeholder="https://maps.google.com/?q=..." disabled={loading} />
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

      {/* Food Items Grid */}
      <main className="container">
        {filteredItems.length > 0 ? (
          <div className="food-grid">
            {filteredItems.map(item => (
              <div className="food-card" key={item.id}>
                <div className="card-image-wrapper">
                  <img className="card-image" src={`/${item.fimage}`} alt={item.fname} />
                  <div className="card-badge">Food</div>
                </div>
                <div className="card-body">
                  <div className="card-venue">{item.fbname}</div>
                  <h3 className="card-title">{item.fname}</h3>
                  <p className="card-description">{item.fdis}</p>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">Price</span>
                      <span className="meta-value">₹{item.fprice}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Phone</span>
                      <span className="meta-value">{item.fphone}</span>
                    </div>
                    {userLocation && item.latitude && item.longitude && (
                      <div className="meta-item">
                        <span className="meta-label">Distance</span>
                        <span className="meta-value distance-badge">
                          {(() => {
                            const R = 6371;
                            const dLat = (item.latitude - userLocation.latitude) * Math.PI / 180;
                            const dLon = (item.longitude - userLocation.longitude) * Math.PI / 180;
                            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(item.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
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
                      <p><strong>Address:</strong> {item.fadd}</p>
                      <p><strong>Phone:</strong> {item.fphone}</p>
                      {item.flocation && (
                        <a href={item.flocation} className="location-link" target="_blank" rel="noopener noreferrer">
                          📍 View on Google Maps
                        </a>
                      )}
                    </div>
                  </details>

                  <div className="card-actions">
                    {user && user.role === 'admin' && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(item)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No meals found. Try adjusting your search.</p>
          </div>
        )}
      </main>

      {/* Google Map Display */}
      {userLocation && filteredItems.length > 0 && (
        <section className="container">
          <GoogleMapComponent 
            items={filteredItems} 
            userLocation={userLocation} 
            title="🗺️ Food Locations Near You" 
            itemType="food"
          />
        </section>
      )}

      {/* Footer */}
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

export default FoodList;
