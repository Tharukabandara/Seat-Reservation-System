import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reservationsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data);
    } catch (error) {
      setError('Failed to load reservations');
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsAPI.cancelReservation(reservationId);
      await fetchMyReservations();
      alert('Reservation cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel reservation');
      console.error('Error cancelling reservation:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const stats = {
    active: reservations.filter(r => r.status === 'active').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="welcome-section">
          <h1 className="page-title">
            Welcome back, {user.name}!
          </h1>
          <p className="page-subtitle">
            {user.role === 'admin' 
              ? 'Manage seats and view all reservations' 
              : 'Manage your seat reservations and book new ones'
            }
          </p>
        </div>
        
        <div className="quick-actions">
          <a href="/booking" className="action-btn primary">
            <span className="btn-icon"></span>
            Book New Seat
          </a>
          {user.role === 'admin' && (
            <a href="/admin" className="action-btn secondary">
              <span className="btn-icon"></span>
              Admin Panel
            </a>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active Reservations</div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
          <div className="stat-icon">🎯</div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
          <div className="stat-icon">❌</div>
        </div>
      </div>

      {/* Reservations Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">My Reservations</h2>
          <button onClick={fetchMyReservations} className="refresh-btn">
            <span className="refresh-icon"></span>
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="reservations-container">
          {reservations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🪑</div>
              <h3>No reservations found</h3>
              <p>Start by booking your first seat!</p>
              <a href="/booking" className="action-btn primary">
                Make Your First Reservation
              </a>
            </div>
          ) : (
            <div className="reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <div className="card-header">
                    <div className="seat-info">
                      <h3 className="seat-title">
                        🪑 Seat {reservation.seat?.seatNumber}
                      </h3>
                      <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{reservation.seat?.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{formatDate(reservation.date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-text">
                        {reservation.timeSlot?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {reservation.status === 'active' && 
                   new Date(reservation.date) > new Date() && (
                    <div className="card-actions">
                      <button
                        onClick={() => handleCancelReservation(reservation._id)}
                        className="cancel-btn"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;