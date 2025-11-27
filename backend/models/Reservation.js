const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'full-day'],
    default: 'full-day'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Ensure one reservation per intern per day
reservationSchema.index({ intern: 1, date: 1 }, { unique: true });

// Method to check if reservation should be completed
reservationSchema.methods.shouldBeCompleted = function() {
  const now = new Date();
  const reservationDate = new Date(this.date);
  
  // Set the end time based on time slot
  let endTime;
  switch(this.timeSlot) {
    case 'morning':
      endTime = new Date(reservationDate);
      endTime.setHours(12, 0, 0, 0); // 12:00 PM
      break;
    case 'afternoon':
      endTime = new Date(reservationDate);
      endTime.setHours(18, 0, 0, 0); // 4:30 PM
      break;
    case 'full-day':
    default:
      endTime = new Date(reservationDate);
      endTime.setHours(23, 59, 59, 999); // End of day
      break;
  }
  
  return now > endTime && this.status === 'active';
};

// Static method to update expired reservations
reservationSchema.statics.updateExpiredReservations = async function() {
  try {
    const activeReservations = await this.find({ status: 'active' });
    const updatedCount = 0;
    
    for (const reservation of activeReservations) {
      if (reservation.shouldBeCompleted()) {
        await this.findByIdAndUpdate(reservation._id, { status: 'completed' });
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} expired reservations to completed status`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error updating expired reservations:', error);
    return 0;
  }
};

module.exports = mongoose.model('Reservation', reservationSchema);