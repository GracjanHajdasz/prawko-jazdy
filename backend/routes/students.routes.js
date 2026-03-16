const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controllers');

router.post('/addNewStudent', studentsController.addNewStudent);
router.post('/displayStudents', studentsController.displayStudents);
router.post('/editStudent', studentsController.editStudent);
router.post('/generateNewCode', studentsController.generateNewCode);
router.post('/getStudentsLessons', studentsController.getStudentsLessons);
router.post('/newInvoice', studentsController.newInvoice);

module.exports = router;