import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">🪑</span>
            <span className="brand-text">Seat Reserve</span>
          </Link>
        </div>
        
        {user && (
          <>
            <div className="navbar-nav">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
              Dashboard
              </Link>
              <Link 
                to="/booking" 
                className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
              >
              Book Seat
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                Admin Dashboard
                </Link>
              )}
            </div>
            
            <div className="navbar-user">
              <div className="user-info">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role}</div>
                </div>
              </div>
              <button onClick={logout} className="logout-btn">
              <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

 