const express = require('express');
const router = express.Router();
const testsController = require('../controllers/tests.controllers');

router.post('/getExam', testsController.getExam);

module.exports = router;