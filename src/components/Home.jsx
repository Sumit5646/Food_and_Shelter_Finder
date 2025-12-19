import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, <span className="user-name">{user.uname}</span>! 👋</h1>
          <p>Find food and shelter resources near you</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        <div className="services-grid">
          {/* Food Service Card */}
          <div className="service-card">
            <div className="card-image-wrapper">
              <img src="/8dccqyazcus71.png" alt="Food" className="card-image" />
              <div className="card-overlay">
                <Link to="/food" className="card-cta">Browse Food ➜</Link>
              </div>
            </div>
            <div className="card-content">
              <h3>🍽️ Food Meals</h3>
              <p>Find meals and food banks in your area. Get information about operating hours and locations.</p>
              <div className="card-stats">
                <span className="stat">Thousands of locations</span>
              </div>
            </div>
          </div>

          {/* Shelter Service Card */}
          <div className="service-card">
            <div className="card-image-wrapper">
              <img src="/depositphotos_53689175-stock-photo-home-for-rent.jpg" alt="Shelter" className="card-image" />
              <div className="card-overlay">
                <Link to="/shelter" className="card-cta">Browse Shelters ➜</Link>
              </div>
            </div>
            <div className="card-content">
              <h3>🏠 Homes & Shelters</h3>
              <p>Find safe shelter and housing solutions. Access information about available accommodations.</p>
              <div className="card-stats">
                <span className="stat">Quick access to help</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/about">About Us</Link>
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

export default Home;
