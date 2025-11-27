import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Seat Reservation System</h3>
            <p>Streamline your office seat booking process with our modern reservation platform.</p>
            <p>Built with modern technologies for the best user experience.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="/dashboard">Dashboard</a>
              <a href="/booking">Book Seat</a>
              <a href="/admin">Admin Panel</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Support</h3>
            <p>Email: support@company.com</p>
            <p>Hotline: 1212</p>
            <p>Office Hours: 8:30 AM - 4:30 PM</p>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Seat Reservation System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;