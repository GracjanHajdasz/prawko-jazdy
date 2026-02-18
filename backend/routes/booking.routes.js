const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controllers');

router.post('/getBookings', bookingController.getBookings);
router.post('/editBookings', bookingController.editBookings);

module.exports = router;