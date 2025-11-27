import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { seatsAPI, reservationsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingSeat, setEditingSeat] = useState(null);

  const [newSeat, setNewSeat] = useState({
    seatNumber: '',
    location: '',
    status: 'available'
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
    fetchSeats();
    fetchReservations();
  }, [user]);

  const fetchSeats = async () => {
    try {
      // Use the new admin API that shows ALL seats
      const response = await seatsAPI.getAllSeatsForAdmin();
      setSeats(response.data);
    } catch (error) {
      setError('Failed to load seats');
      console.error('Error fetching seats:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getAllReservations();
      setReservations(response.data);
    } catch (error) {
      setError('Failed to load reservations');
      console.error('Error fetching reservations:', error);
    }
  };

  const handleCreateSeat = async (e) => {
    e.preventDefault();
    
    if (!newSeat.seatNumber || !newSeat.location) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await seatsAPI.createSeat(newSeat);
      setNewSeat({ seatNumber: '', location: '', status: 'available' });
      await fetchSeats();
      alert('Seat created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create seat';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSeat = async (e) => {
    e.preventDefault();
    
    if (!editingSeat.seatNumber || !editingSeat.location) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await seatsAPI.updateSeat(editingSeat._id, {
        seatNumber: editingSeat.seatNumber,
        location: editingSeat.location,
        status: editingSeat.status
      });
      setEditingSeat(null);
      await fetchSeats();
      alert('Seat updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update seat';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeat = async (seatId) => {
    if (!window.confirm('Are you sure you want to delete this seat?')) {
      return;
    }

    try {
      await seatsAPI.deleteSeat(seatId);
      await fetchSeats();
      alert('Seat deleted successfully!');
    } catch (error) {
      alert('Failed to delete seat');
      console.error('Error deleting seat:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  if (user?.role !== 'admin') {
    return (
      <div className="page-container">
        <div className="error-card">
          <h1 className="error-title">Access Denied</h1>
          <p className="error-text">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalSeats: seats.length,
    availableSeats: seats.filter(s => s.status === 'available').length,
    unavailableSeats: seats.filter(s => s.status === 'unavailable').length,
    maintenanceSeats: seats.filter(s => s.status === 'maintenance').length,
    activeReservations: reservations.filter(r => r.status === 'active').length,
    totalReservations: reservations.length
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="welcome-section">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage seats and view all reservations</p>
        </div>
        
        <div className="quick-actions">
          <a href="/dashboard" className="action-btn secondary">
            <span className="btn-icon"></span>
            Dashboard
          </a>
          <a href="/booking" className="action-btn primary">
            <span className="btn-icon"></span>
            Book Seat
          </a>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-content">
            <div className="stat-number">{stats.totalSeats}</div>
            <div className="stat-label">Total Seats</div>
          </div>
          <div className="stat-icon">🪑</div>
        </div>
        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-number">{stats.availableSeats}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-number">{stats.maintenanceSeats}</div>
            <div className="stat-label">Maintenance</div>
          </div>
          <div className="stat-icon">🔧</div>
        </div>
        <div className="stat-card info">
          <div className="stat-content">
            <div className="stat-number">{stats.activeReservations}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
          <div className="stat-icon">📋</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
        >
          📋 All Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('seats')}
          className={`tab-btn ${activeTab === 'seats' ? 'active' : ''}`}
        >
          🪑 Manage Seats ({seats.length})
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">All Reservations</h2>
            <button onClick={fetchReservations} className="refresh-btn">
              <span className="refresh-icon"></span>
              Refresh
            </button>
          </div>

          <div className="table-container">
            {reservations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No reservations found</h3>
                <p>Reservations will appear here when users book seats.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Intern</th>
                      <th>Seat</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-name">{reservation.intern?.name}</div>
                            <div className="user-email">{reservation.intern?.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="seat-cell">
                            <div className="seat-number">Seat {reservation.seat?.seatNumber}</div>
                            <div className="seat-location">{reservation.seat?.location}</div>
                          </div>
                        </td>
                        <td className="date-cell">{formatDate(reservation.date)}</td>
                        <td className="time-cell">{reservation.timeSlot?.replace('-', ' ')}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seats Tab */}
      {activeTab === 'seats' && (
        <div className="seats-section">
          {/* Add/Edit Seat Form */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                {editingSeat ? 'Edit Seat' : 'Add New Seat'}
              </h2>
              {editingSeat && (
                <button 
                  onClick={() => setEditingSeat(null)}
                  className="cancel-edit-btn"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="form-container">
              <form onSubmit={editingSeat ? handleEditSeat : handleCreateSeat} className="seat-form">
                <div className="form-group">
                  <label className="form-label">Seat Number</label>
                  <input
                    type="text"
                    value={editingSeat ? editingSeat.seatNumber : newSeat.seatNumber}
                    onChange={(e) => 
                      editingSeat 
                        ? setEditingSeat({...editingSeat, seatNumber: e.target.value})
                        : setNewSeat({...newSeat, seatNumber: e.target.value})
                    }
                    className="form-input"
                    placeholder="A1, B2, etc."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={editingSeat ? editingSeat.location : newSeat.location}
                    onChange={(e) => 
                      editingSeat 
                        ? setEditingSeat({...editingSeat, location: e.target.value})
                        : setNewSeat({...newSeat, location: e.target.value})
                    }
                    className="form-input"
                    placeholder="Floor 1 - Window Side"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={editingSeat ? editingSeat.status : newSeat.status}
                    onChange={(e) => 
                      editingSeat 
                        ? setEditingSeat({...editingSeat, status: e.target.value})
                        : setNewSeat({...newSeat, status: e.target.value})
                    }
                    className="form-select"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 
                   editingSeat ? 'Update Seat' : 'Add Seat'}
                </button>
              </form>
            </div>
          </div>

          {/* Seats List */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">All Seats</h2>
              <div className="seat-filters">
                <span className="filter-badge available">Available: {stats.availableSeats}</span>
                <span className="filter-badge unavailable">Unavailable: {stats.unavailableSeats}</span>
                <span className="filter-badge maintenance">Maintenance: {stats.maintenanceSeats}</span>
              </div>
            </div>
            
            <div className="seats-grid">
              {seats.map((seat) => (
                <div key={seat._id} className={`seat-card ${seat.status}`}>
                  <div className="seat-header">
                    <div className="seat-info">
                      <h3 className="seat-title">🪑 Seat {seat.seatNumber}</h3>
                      <span className={`seat-status-badge ${seat.status}`}>
                        {seat.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="seat-details">
                    <p className="seat-location">📍 {seat.location}</p>
                    <p className="seat-created">
                      Created: {new Date(seat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="seat-actions">
                    <button
                      onClick={() => setEditingSeat(seat)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSeat(seat._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;