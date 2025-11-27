import React from 'react';

const SeatGrid = ({ seats, selectedSeat, onSeatSelect, unavailableSeats = [] }) => {
  const isSeatUnavailable = (seatId) => {
    return unavailableSeats.includes(seatId);
  };

  // Group seats by location
  const groupedSeats = seats.reduce((acc, seat) => {
    const location = seat.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(seat);
    return acc;
  }, {});

  // Filter and separate seats
  const availableSeats = seats.filter(seat => !isSeatUnavailable(seat._id));
  const unavailableSeatsData = seats.filter(seat => isSeatUnavailable(seat._id));

  return (
    <div className="seat-grid-container">
      {/* Legend */}
      <div className="seat-legend">
        <h3 className="legend-title">Seat Legend:</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon available">🪑</span>
            <span className="legend-text">Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon selected">✅</span>
            <span className="legend-text">Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon unavailable">🚫</span>
            <span className="legend-text">Unavailable</span>
          </div>
        </div>
      </div>

      {seats.length === 0 ? (
        <div className="empty-seats">
          <div className="empty-seats-icon">🪑</div>
          <h3>No seats available</h3>
          <p>Please try selecting a different date</p>
        </div>
      ) : (
        <>
          {/* Available Seats by Location */}
          {Object.entries(groupedSeats).map(([location, locationSeats]) => {
            const availableInLocation = locationSeats.filter(seat => !isSeatUnavailable(seat._id));
            const unavailableInLocation = locationSeats.filter(seat => isSeatUnavailable(seat._id));
            
            return (
              <div key={location} className="seat-section">
                <div className="section-title-bar">
                  <h3 className="section-title">
                    📍 {location} ({availableInLocation.length} available, {unavailableInLocation.length} unavailable)
                  </h3>
                </div>
                
                <div className="seats-grid">
                  {locationSeats.map((seat) => {
                    const isUnavailable = isSeatUnavailable(seat._id);
                    const isSelected = selectedSeat?._id === seat._id;
                    
                    return (
                      <div
                        key={seat._id}
                        onClick={() => !isUnavailable && onSeatSelect(seat)}
                        className={`seat-selection-card ${
                          isUnavailable 
                            ? 'seat-disabled' 
                            : isSelected 
                            ? 'seat-selected' 
                            : 'seat-available'
                        }`}
                      >
                        <div className="seat-card-content">
                          <div className="seat-icon-wrapper">
                            <div className="seat-icon">
                              {isUnavailable ? '🚫' : isSelected ? '✅' : '🪑'}
                            </div>
                          </div>
                          
                          <div className="seat-card-info">
                            <h4 className="seat-card-title">Seat {seat.seatNumber}</h4>
                            <p className="seat-card-location">{seat.location}</p>
                            
                            <div className="seat-card-status">
                              <span className={
                                isUnavailable 
                                  ? 'status-unavailable' 
                                  : isSelected 
                                  ? 'status-selected' 
                                  : 'status-available'
                              }>
                                {isUnavailable ? 'Unavailable' : isSelected ? 'Selected' : 'Available'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover overlay effect */}
                        <div className="seat-hover-overlay"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SeatGrid;