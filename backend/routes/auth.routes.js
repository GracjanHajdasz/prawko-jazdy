const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// user registration route
router.post('/register', authController.register);
// user login route
router.post('/login', authController.login);

module.exports = router;
