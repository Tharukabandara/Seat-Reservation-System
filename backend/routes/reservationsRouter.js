const express = require('express');
const { 
  createReservation, 
  getMyReservations, 
  cancelReservation,
  getAllReservations 
} = require('../controllers/reservationController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createReservation);
router.get('/my', auth, getMyReservations);
router.put('/:id/cancel', auth, cancelReservation);
router.get('/all', adminAuth, getAllReservations);

module.exports = router;