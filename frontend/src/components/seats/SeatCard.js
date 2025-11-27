import React from 'react';

const SeatCard = ({ seat, isSelected, onSelect, disabled = false }) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect(seat);
    }
  };

  const getCardStyle = () => {
    if (disabled) {
      return {
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
        cursor: 'not-allowed',
        opacity: 0.6
      };
    }
    
    if (isSelected) {
      return {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
        color: '#1e40af',
        borderWidth: '2px'
      };
    }
    
    return {
      backgroundColor: 'white',
      borderColor: '#d1d5db',
      cursor: 'pointer',
      borderWidth: '1px'
    };
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-lg p-4 border transition-all hover:shadow-md"
      style={getCardStyle()}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">
          {disabled ? '🚫' : '🪑'}
        </div>
        <h3 className="font-medium text-sm mb-1">
          Seat {seat.seatNumber}
        </h3>
        <p className="text-xs opacity-75">
          {seat.location}
        </p>
        {disabled && (
          <p className="text-xs mt-2 font-medium">
            Not Available
          </p>
        )}
      </div>
    </div>
  );
};

export default SeatCard;