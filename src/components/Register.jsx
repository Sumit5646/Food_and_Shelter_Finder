import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './Register.css';

const API_BASE_URL = 'http://localhost:3001';

export default function Register() {
  const [formData, setFormData] = useState({ uname: '', uemail: '', umobile: '', upass: '', ucpass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.uname || !formData.uemail || !formData.umobile || !formData.upass || !formData.ucpass) {
      setError('All fields are required');
      return;
    }

    if (formData.upass !== formData.ucpass) {
      setError('Passwords do not match');
      return;
    }

    if (formData.umobile.length !== 10 || !/^\d+$/.test(formData.umobile)) {
      setError('Mobile number must be 10 digits');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.uemail)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching users from:', `${API_BASE_URL}/users`);
      
      // Check if username already exists
      const checkResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Users fetched:', checkResponse.data);
      
      const users = checkResponse.data;
      if (users.some(u => u.uname === formData.uname)) {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      // Register new user
      console.log('Creating new user:', formData);
      const response = await axios.post(`${API_BASE_URL}/users`, {
        uname: formData.uname,
        uemail: formData.uemail,
        umobile: formData.umobile,
        upass: formData.upass
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        console.log('User registered successfully:', response.data);
        setFormData({ uname: '', uemail: '', umobile: '', upass: '', ucpass: '' });
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError('Cannot connect to server. Make sure JSON Server is running on http://localhost:3001');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-wrapper">
        <img alt="register" src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800" className="register-bg" />
        <div className="register-card">
          <h2>Create Account</h2>
          {error && <div className="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="uname">Username</label>
              <input
                id="uname"
                type="text"
                placeholder="Enter username"
                name="uname"
                value={formData.uname}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="uemail">Email</label>
              <input
                id="uemail"
                type="email"
                placeholder="Enter email"
                name="uemail"
                value={formData.uemail}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="umobile">Mobile Number</label>
              <input
                id="umobile"
                type="text"
                placeholder="10-digit mobile number"
                name="umobile"
                value={formData.umobile}
                onChange={handleChange}
                disabled={loading}
                maxLength="10"
              />
            </div>
            <div className="form-group">
              <label htmlFor="upass">Password</label>
              <input
                id="upass"
                type="password"
                placeholder="Enter password"
                name="upass"
                value={formData.upass}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ucpass">Confirm Password</label>
              <input
                id="ucpass"
                type="password"
                placeholder="Confirm password"
                name="ucpass"
                value={formData.ucpass}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
