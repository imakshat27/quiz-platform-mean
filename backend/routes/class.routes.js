const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.post('/create', checkSession, classController.createClass);
router.post('/join', checkSession, classController.joinClass);
router.get('/teacher', checkSession, classController.getTeacherClasses);
router.get('/student', checkSession, classController.getStudentClasses);
router.get('/:id/details', checkSession, classController.getClassDetails);
router.post('/:id/remove-student', checkSession, classController.removeStudentFromClass);

module.exports = router;
