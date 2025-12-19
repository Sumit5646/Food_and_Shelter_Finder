import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) {
    // Navbar for non-authenticated pages
    return (
      <nav className="navbar navbar-light">
        <div className="navbar-container">
          <Link className="navbar-brand" to="/">
            <span className="brand-icon">🏠</span>
            Food & Shelter Finder
          </Link>
          
          <button 
            className="navbar-toggler"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="toggler-icon">☰</span>
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="navbar-links">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                📧 Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Navbar for authenticated users
  return (
    <nav className="navbar navbar-light navbar-authenticated">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/home">
          <span className="brand-icon">🏠</span>
          Food & Shelter Finder
        </Link>
        
        <button 
          className="navbar-toggler"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="toggler-icon">☰</span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link 
              to="/home" 
              className={`nav-link ${isActive('/home') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/food" 
              className={`nav-link ${isActive('/food') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              🍽️ Food
            </Link>
            <Link 
              to="/shelter" 
              className={`nav-link ${isActive('/shelter') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Shelter
            </Link>
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍💼 Admin
              </Link>
            )}
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              📧 Contact Us
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {user.uname.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">{user.uname}</div>
                <div className="user-email">{user.uemail}</div>
              </div>
            </div>
            <button 
              className="btn-logout"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
