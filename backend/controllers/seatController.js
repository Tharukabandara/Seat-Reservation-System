const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');

const getSeats = async (req, res) => {
  try {
    const { date, includeAll } = req.query;
    
    // Include all seats for admin
    if (includeAll === 'true') {
      const allSeats = await Seat.find({});
      return res.json(allSeats);
    }
    
    // For regular users, show available seats
    const seats = await Seat.find({ status: 'available' });

    if (date) {
      const reservedSeatIds = await Reservation.find({
        date: new Date(date),
        status: 'active'
      }).distinct('seat');

      const availableSeats = seats.filter(
        seat => !reservedSeatIds.some(id => id.toString() === seat._id.toString())
      );

      return res.json(availableSeats);
    }

    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.status(201).json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    res.json({ message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all seats for admin
const getAllSeatsForAdmin = async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getSeats, 
  createSeat, 
  updateSeat, 
  deleteSeat,
  getAllSeatsForAdmin
};