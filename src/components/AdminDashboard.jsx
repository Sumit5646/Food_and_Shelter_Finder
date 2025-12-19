import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:3001';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [shelterItems, setShelterItems] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      navigate('/home', { replace: true });
      return;
    }

    fetchUsers();
    fetchFood();
    fetchShelter();
    fetchFeedback();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFood = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/food`);
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food:', error);
    }
  };

  const fetchShelter = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shelter`);
      setShelterItems(response.data);
    } catch (error) {
      console.error('Error fetching shelter:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback`);
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleEditUser = (user) => {
    setFormData(user);
    setEditingId(user.id);
    setActiveTab('users-edit');
    setShowEditModal(true);
  };

  const handleEditFood = (food) => {
    setFormData(food);
    setEditingId(food.id);
    setActiveTab('food-edit');
    setShowEditModal(true);
  };

  const handleEditShelter = (shelter) => {
    setFormData(shelter);
    setEditingId(shelter.id);
    setActiveTab('shelter-edit');
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = '';
      if (activeTab.includes('users')) {
        endpoint = `${API_BASE_URL}/users/${editingId}`;
      } else if (activeTab.includes('food')) {
        endpoint = `${API_BASE_URL}/food/${editingId}`;
      } else if (activeTab.includes('shelter')) {
        endpoint = `${API_BASE_URL}/shelter/${editingId}`;
      }

      await axios.put(endpoint, formData);
      alert('Updated successfully');
      setShowEditModal(false);
      if (activeTab.includes('users')) fetchUsers();
      else if (activeTab.includes('food')) fetchFood();
      else if (activeTab.includes('shelter')) fetchShelter();
      setActiveTab(activeTab.replace('-edit', ''));
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const deleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/food/${id}`);
        fetchFood();
      } catch (error) {
        console.error('Error deleting food:', error);
        alert('Error deleting food');
      }
    }
  };

  const deleteShelter = async (id) => {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await axios.delete(`${API_BASE_URL}/shelter/${id}`);
        fetchShelter();
      } catch (error) {
        console.error('Error deleting shelter:', error);
        alert('Error deleting shelter');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="admin-dashboard">
      <Navbar />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit {activeTab.includes('users') ? 'User' : activeTab.includes('food') ? 'Food Item' : 'Shelter'}</h2>
            <form onSubmit={handleSaveEdit}>
              {activeTab.includes('users') && (
                <>
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="uname" value={formData.uname || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="uemail" value={formData.uemail || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input type="tel" name="umobile" value={formData.umobile || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                </>
              )}
              {activeTab.includes('food') && (
                <>
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" name="fbname" value={formData.fbname || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Food Name</label>
                    <input type="text" name="fname" value={formData.fname || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" name="fdis" value={formData.fdis || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" step="0.01" name="fprice" value={formData.fprice || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="fadd" value={formData.fadd || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="fphone" value={formData.fphone || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                </>
              )}
              {activeTab.includes('shelter') && (
                <>
                  <div className="form-group">
                    <label>Shelter Name</label>
                    <input type="text" name="hname" value={formData.hname || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" name="hdis" value={formData.hdis || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="haddress" value={formData.haddress || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="hphone" value={formData.hphone || ''} onChange={handleFormChange} required disabled={loading} />
                  </div>
                </>
              )}
              <div className="form-buttons">
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={loading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h3>📊 Admin Panel</h3>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              User Data
              <span className="badge">{users.length}</span>
            </button>
            <button 
              className={`nav-button ${activeTab === 'food' ? 'active' : ''}`}
              onClick={() => setActiveTab('food')}
            >
              <span className="nav-icon">🍽️</span>
              Food Items
              <span className="badge">{foodItems.length}</span>
            </button>
            <button 
              className={`nav-button ${activeTab === 'shelter' ? 'active' : ''}`}
              onClick={() => setActiveTab('shelter')}
            >
              <span className="nav-icon">🏠</span>
              Shelters
              <span className="badge">{shelterItems.length}</span>
            </button>
            <button 
              className={`nav-button ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <span className="nav-icon">📧</span>
              Feedback
              <span className="badge">{feedbackList.length}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>User Management</h2>
                <p>{users.length} users registered</p>
              </div>
              {users.length > 0 ? (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="cell-id">{user.id}</td>
                          <td className="cell-name">{user.uname}</td>
                          <td className="cell-email">{user.uemail}</td>
                          <td className="cell-phone">{user.umobile}</td>
                          <td className="cell-actions">
                            <button className="btn-edit-small" onClick={() => handleEditUser(user)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => deleteUser(user.id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-message">No users found</div>
              )}
            </div>
          )}

          {/* Food Items Tab */}
          {activeTab === 'food' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Food Items Management</h2>
                <p>{foodItems.length} food items listed</p>
              </div>
              {foodItems.length > 0 ? (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Business Name</th>
                        <th>Food Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodItems.map(item => (
                        <tr key={item.id}>
                          <td className="cell-id">{item.id}</td>
                          <td className="cell-name">{item.fbname}</td>
                          <td className="cell-name">{item.fname}</td>
                          <td className="cell-description">{item.fdis}</td>
                          <td className="cell-price">₹{item.fprice}</td>
                          <td className="cell-actions">
                            <button className="btn-edit-small" onClick={() => handleEditFood(item)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => deleteFood(item.id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-message">No food items found</div>
              )}
            </div>
          )}

          {/* Shelters Tab */}
          {activeTab === 'shelter' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Shelters Management</h2>
                <p>{shelterItems.length} shelters listed</p>
              </div>
              {shelterItems.length > 0 ? (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Shelter Name</th>
                        <th>Description</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shelterItems.map(item => (
                        <tr key={item.id}>
                          <td className="cell-id">{item.id}</td>
                          <td className="cell-name">{item.hname}</td>
                          <td className="cell-description">{item.hdis}</td>
                          <td className="cell-address">{item.haddress}</td>
                          <td className="cell-actions">
                            <button className="btn-edit-small" onClick={() => handleEditShelter(item)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => deleteShelter(item.id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-message">No shelters found</div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Customer Feedback</h2>
                <p>{feedbackList.length} feedback messages</p>
              </div>
              {feedbackList.length > 0 ? (
                <div className="feedback-list">
                  {feedbackList.map(feedback => (
                    <div key={feedback.id} className="feedback-card">
                      <div className="feedback-header">
                        <div className="feedback-user-info">
                          <h3>{feedback.userName}</h3>
                          <p className="feedback-email">{feedback.userEmail}</p>
                        </div>
                        <span className={`feedback-status status-${feedback.status}`}>{feedback.status}</span>
                      </div>
                      <div className="feedback-subject">
                        <strong>Subject:</strong> {feedback.subject}
                      </div>
                      {feedback.phone && (
                        <div className="feedback-phone">
                          <strong>Phone:</strong> {feedback.phone}
                        </div>
                      )}
                      <div className="feedback-message">
                        <strong>Message:</strong>
                        <p>{feedback.message}</p>
                      </div>
                      <div className="feedback-date">
                        {new Date(feedback.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">No feedback yet</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
