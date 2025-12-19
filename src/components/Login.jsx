import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './Login.css';

const API_BASE_URL = 'http://localhost:3001';

function Login() {
  const [formData, setFormData] = useState({
    uname: '',
    upass: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting to fetch from:', `${API_BASE_URL}/users`);
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Users fetched:', response.data);
      
      const users = response.data;
      const user = users.find(u => u.uname === formData.uname && u.upass === formData.upass);
      
      if (user) {
        console.log('User found:', user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        console.log('No matching user found');
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setError('Cannot connect to server. Make sure JSON Server is running on http://localhost:3001');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-wrapper">
        <img src="/l-intro-1645057933.jpg" className="login-bg" alt="Background" />
        <div className="login-card">
          <h2>🔐 Login</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="uname" 
                placeholder="Enter your username"
                value={formData.uname} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="upass" 
                placeholder="Enter your password"
                value={formData.upass} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
            <p><a href="#">Forgot password?</a></p>
          </div>
        </div>
      </div>

      <marquee direction="right" className="marquee-bottom">Login Now to Access Food and Shelter Services</marquee>
    </div>
  );
}

export default Login;
