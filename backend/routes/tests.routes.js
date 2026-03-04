const express = require('express');
const router = express.Router();
const testsController = require('../controllers/tests.controllers');

router.post('/getExam', testsController.getExam);
router.post('/getExamsResults', testsController.getExamsResults);
router.post('/saveExamResults', testsController.saveExamResults);
router.post('/getExamQuestions', testsController.getExamQuestions);

module.exports = router;