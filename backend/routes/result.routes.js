const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.post('/submit-quiz', checkSession, resultController.submitQuiz);
router.get('/quiz/:quizId/results', checkSession, resultController.getQuizResults);
router.get('/my-attempts', checkSession, resultController.getMyAttempts);
router.put('/hide-attempt/:attemptId', checkSession, resultController.hideAttempt);

module.exports = router;
