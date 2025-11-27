const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRouter');
const seatRoutes = require('./routes/seatsRouter');
const reservationRoutes = require('./routes/reservationsRouter');

const app = express();

// Import Reservation model for scheduled updates
const Reservation = require('./models/Reservation');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seat-reservation')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the reservation status update scheduler
    startReservationStatusScheduler();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Function to update expired reservations
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
      console.log(`Auto-updated ${updatedCount} expired reservations to completed status`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error in scheduled reservation update:', error);
    return 0;
  }
};

// Scheduler function to run every hour
const startReservationStatusScheduler = () => {
  // Run immediately on startup
  updateExpiredReservations();
  
  // Then run every hour
  setInterval(async () => {
    console.log('Running scheduled reservation status update...');
    await updateExpiredReservations();
  }, 3600000); //ms
  
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/reservations', reservationRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Seat Reservation API is running!' });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const activeReservations = await Reservation.countDocuments({ status: 'active' });
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });
    
    res.json({
      status: 'healthy',
      database: dbStatus,
      reservations: {
        active: activeReservations,
        completed: completedReservations
      },
      scheduler: 'running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});