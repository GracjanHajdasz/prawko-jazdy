const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const bookingController = require('../controllers/booking.controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/get-user-data', authController.getUserData);
router.post('/bookings', bookingController.getBookings);
router.post('/save-booking', bookingController.saveBooking);
router.post('/cancel-booking', bookingController.cancelBooking);

module.exports = router;