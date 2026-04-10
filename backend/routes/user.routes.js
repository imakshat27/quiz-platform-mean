const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.get('/teachers', userController.getTeachers);
router.get('/my-students', checkSession, userController.getMyStudents);
router.get('/student/:id/analytics', checkSession, userController.getStudentAnalytics);
router.get('/my-analytics', checkSession, userController.getMyAnalytics);

module.exports = router;
