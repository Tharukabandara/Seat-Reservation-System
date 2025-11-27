const express = require('express');
const { 
  getSeats, 
  createSeat, 
  updateSeat, 
  deleteSeat,
  getAllSeatsForAdmin
} = require('../controllers/seatController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getSeats);
router.get('/admin/all', adminAuth, getAllSeatsForAdmin); // New route for admin
router.post('/', adminAuth, createSeat);
router.put('/:id', adminAuth, updateSeat);
router.delete('/:id', adminAuth, deleteSeat);

module.exports = router;