const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');

// Helper function to update expired reservations
const updateExpiredReservations = async () => {
  try {
    const now = new Date();
    
    // Find all active reservations
    const activeReservations = await Reservation.find({ status: 'active' });
    let updatedCount = 0;
    
    for (const reservation of activeReservations) {
      const reservationDate = new Date(reservation.date);
      let endTime;
      
      // Calculate end time based on time slot
      switch(reservation.timeSlot) {
        case 'morning':
          endTime = new Date(reservationDate);
          endTime.setHours(12, 0, 0, 0); // 12:00 PM
          break;
        case 'afternoon':
          endTime = new Date(reservationDate);
          endTime.setHours(18, 0, 0, 0); // 6:00 PM
          break;
        case 'full-day':
        default:
          endTime = new Date(reservationDate);
          endTime.setHours(23, 59, 59, 999); // End of day
          break;
      }
      
      // If current time is past the end time, mark as completed
      if (now > endTime) {
        await Reservation.findByIdAndUpdate(reservation._id, { status: 'completed' });
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`✅ Updated ${updatedCount} expired reservations to completed status`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('❌ Error updating expired reservations:', error);
    return 0;
  }
};

const createReservation = async (req, res) => {
  try {
    const { seatId, date, timeSlot } = req.body;
    const internId = req.user._id;

    // Update expired reservations before processing new reservation
    await updateExpiredReservations();

    // ✅ Normalize date to midnight to ensure consistent comparison
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (reservationDate < oneHourFromNow) {
      return res.status(400).json({ 
        message: 'Seat must be reserved at least 1 hour in advance' 
      });
    }

    // Check if intern already has a reservation for this date
    const existingReservation = await Reservation.findOne({
      intern: internId,
      date: reservationDate,
      status: 'active'
    });

    if (existingReservation) {
      return res.status(400).json({ 
        message: 'You already have a reservation for this date' 
      });
    }

    // Check if seat is available
    const seatReservation = await Reservation.findOne({
      seat: seatId,
      date: reservationDate,
      status: 'active'
    });

    if (seatReservation) {
      return res.status(400).json({ 
        message: 'Seat is already booked for this date' 
      });
    }

    try {
      const reservation = await Reservation.create({
        intern: internId,
        seat: seatId,
        date: reservationDate,
        timeSlot: timeSlot || 'full-day'
      });

      await reservation.populate(['intern', 'seat']);
      res.status(201).json(reservation);
    } catch (err) {
      // ✅ Catch duplicate key error (Mongo unique index)
      if (err.code === 11000) {
        return res.status(400).json({ 
          message: 'You already have a reservation for this date' 
        });
      }
      throw err;
    }
  } catch (error) {
    console.error('❌ Error creating reservation:', error);
    res.status(400).json({ message: error.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    // Update expired reservations before fetching
    await updateExpiredReservations();
    
    const reservations = await Reservation.find({ intern: req.user._id })
      .populate('seat')
      .sort({ date: -1 });
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelReservation = async (req, res) => {
  try {
    // Update expired reservations first
    await updateExpiredReservations();
    
    const reservation = await Reservation.findOneAndUpdate(
      { 
        _id: req.params.id, 
        intern: req.user._id,
        status: 'active'
      },
      { status: 'cancelled' },
      { new: true }
    ).populate('seat');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or cannot be cancelled' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    // Update expired reservations before fetching
    await updateExpiredReservations();
    
    const { date, intern } = req.query;
    let query = {};

    if (date) {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      query.date = normalizedDate;
    }
    if (intern) {
      query.intern = intern;
    }

    const reservations = await Reservation.find(query)
      .populate(['intern', 'seat'])
      .sort({ date: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint to manually trigger status updates
const updateReservationStatuses = async (req, res) => {
  try {
    const updatedCount = await updateExpiredReservations();
    res.json({ 
      message: `Successfully updated ${updatedCount} reservations`,
      updatedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createReservation, 
  getMyReservations, 
  cancelReservation, 
  getAllReservations,
  updateReservationStatuses
};
