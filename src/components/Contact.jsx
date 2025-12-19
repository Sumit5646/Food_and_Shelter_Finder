import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Contact.css';

const API_BASE_URL = 'http://localhost:3001';

function Contact() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        name: userData.uname,
        email: userData.uemail
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        id: Date.now().toString(),
        ...formData,
        userId: user ? user.id : null,
        userName: formData.name,
        userEmail: formData.email,
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
      
      setSuccessMessage('✅ Thank you! Your feedback has been submitted successfully.');
      
      setFormData({
        name: user ? user.uname : '',
        email: user ? user.uemail : '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <section className="contact-header">
        <h1>📧 Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
      </section>

      <div className="contact-container">
        <div className="form-wrapper">
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is your feedback about?"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please share your feedback, suggestions, or concerns..."
                rows="6"
                disabled={loading}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/contact">Contact Us</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://linkedin.com">LinkedIn</a>
          </div>
          <p>&copy; 2024 Food & Shelter Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
