import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './FrontPage.css';

function FrontPage() {
  return (
    <div className="frontpage">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <img src="/l-intro-1645057933.jpg" alt="Hero Background" className="hero-bg" />
        <div className="hero-content">
          <h1>Food & Shelter Finder</h1>
          <p className="hero-subtitle">Find Food and Shelter Near You</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary-large">Get Started</Link>
            <Link to="/about" className="btn btn-secondary-large">Learn More</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Find Resources</h3>
              <p>Search for food banks and shelters in your area</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Locate</h3>
              <p>View locations, hours, and contact details</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Get Help</h3>
              <p>Connect with services when you need them most</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Help?</h2>
          <p>Join thousands of people finding food and shelter resources</p>
          <Link to="/register" className="btn btn-primary-large">Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <ul>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Food & Shelter Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FrontPage;
