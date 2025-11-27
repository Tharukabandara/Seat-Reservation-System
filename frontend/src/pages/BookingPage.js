import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { seatsAPI, reservationsAPI } from '../services/api';
import SeatGrid from '../components/seats/SeatGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingPage = () => {
  const { user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('full-day');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unavailableSeats, setUnavailableSeats] = useState([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSeats();
    }
  }, [selectedDate]);

  const fetchAvailableSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const seatsResponse = await seatsAPI.getSeats();
      const allSeats = seatsResponse.data;
      
      const availableResponse = await seatsAPI.getSeats(selectedDate);
      const availableSeats = availableResponse.data;
      
      const unavailableSeatIds = allSeats
        .filter(seat => !availableSeats.find(available => available._id === seat._id))
        .map(seat => seat._id);
      
      setSeats(allSeats);
      setUnavailableSeats(unavailableSeatIds);
      
      if (selectedSeat && unavailableSeatIds.includes(selectedSeat._id)) {
        setSelectedSeat(null);
      }
    } catch (error) {
      setError('Failed to load seats');
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const handleBooking = async () => {
    if (!selectedSeat) {
      alert('Please select a seat');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      setBookingLoading(true);
      
      await reservationsAPI.createReservation({
        seatId: selectedSeat._id,
        date: selectedDate,
        timeSlot: timeSlot
      });

      alert('Seat booked successfully! 🎉');
      window.location.href = '/dashboard';
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to book seat';
      alert(errorMessage);
      console.error('Booking error:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="welcome-section">
          <h1 className="page-title">Book a Seat</h1>
          <p className="page-subtitle">Select your preferred seat and date</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Reservation Details</h2>
        </div>
        
        <div className="form-container">
          <div className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeSlot" className="form-label">
                  Time Slot
                </label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="form-select"
                >
                  <option value="full-day">Full Day</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Selected Seat
                </label>
                <div className="selected-seat-display">
                  {selectedSeat ? (
                    <span className="selected-seat-text">
                      🪑 Seat {selectedSeat.seatNumber}
                    </span>
                  ) : (
                    <span className="no-seat-text">No seat selected</span>
                  )}
                </div>
              </div>
            </div>

            {selectedSeat && (
              <div className="booking-summary">
                <h4 className="summary-title">Booking Summary:</h4>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="summary-icon">📍</span>
                    <span>Location: {selectedSeat.location}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">📅</span>
                    <span>Date: {new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">⏰</span>
                    <span>Time: {timeSlot.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedSeat || !selectedDate || bookingLoading}
              className="booking-btn"
            >
              {bookingLoading ? <LoadingSpinner size="sm" /> : 'Book Seat 🎯'}
            </button>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Available Seats</h2>
          {selectedDate && (
            <div className="date-info">
              For {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          )}
        </div>

        <div className="seats-container">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner size="lg" text="Loading available seats..." />
          ) : (
            <SeatGrid
              seats={seats}
              selectedSeat={selectedSeat}
              onSeatSelect={handleSeatSelect}
              unavailableSeats={unavailableSeats}
            />
          )}
        </div>
      </div>

      {/* Booking Rules */}
      <div className="info-section">
        <div className="info-card">
          <h3 className="info-title">📋 Booking Rules:</h3>
          <ul className="info-list">
            <li>You can only book one seat per day</li>
            <li>Seats must be booked at least 1 hour in advance</li>
            <li>Bookings can be made up to 30 days in advance</li>
            <li>You can cancel active reservations from your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;