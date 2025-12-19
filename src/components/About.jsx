import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <Navbar />

      <section className="page-header">
        <h1>About Food & Shelter Finder</h1>
        <p>Helping migrants find essential services in urban areas</p>
      </section>

      <main className="container">
        <section className="content-section">
          <h2>Our Mission</h2>
          <p>Welcome to Food and Shelter Finder, a web application designed to help people who have migrated into cities in search of job and education. This application will help these people to find proper food and shelter as they are not aware of the locations in the city.</p>
          <p>We believe that access to food and shelter is a fundamental right, and we're committed to making the transition to city life easier and more comfortable for migrants.</p>
        </section>

        <section className="content-section">
          <h2>Why We Started</h2>
          <p>Many migrants face significant challenges when moving to a new city. Finding reliable food services and shelter options can be overwhelming without local knowledge. Our platform bridges this gap by providing:</p>
          <ul className="benefits-list">
            <li>Easy access to food banks and meal services</li>
            <li>Comprehensive shelter and housing options</li>
            <li>Location information and contact details</li>
            <li>A supportive community of fellow migrants</li>
          </ul>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Developer</h3>
              <p>Responsible for frontend development and UI/UX design to create an intuitive user experience.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Backend Developer</h3>
              <p>Handles server-side logic, database management, and API integration.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h3>Project Manager</h3>
              <p>Oversees project progress and coordinates team efforts for timely delivery.</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Get in Touch</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <div className="contact-options">
            <Link to="/contact" className="contact-btn">Contact Form</Link>
            <a href="#" className="contact-btn">Instagram</a>
            <a href="#" className="contact-btn">LinkedIn</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <p>&copy; 2024 Food & Shelter Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
