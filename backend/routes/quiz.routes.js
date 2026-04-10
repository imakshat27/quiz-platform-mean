const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.post('/create-quiz', checkSession, quizController.createQuiz);
router.get('/my-quizzes', checkSession, quizController.getMyQuizzes);
router.get('/assigned', checkSession, quizController.getAssignedQuizzes);
router.get('/eligibility/:code', checkSession, quizController.getEligibility);
router.get('/quiz/:id', checkSession, quizController.getQuizById);
router.get('/code/:code', checkSession, quizController.getQuizByCode);
router.get('/quiz/code/:code', checkSession, quizController.getQuizByCode);
router.delete('/quiz/:quizId', checkSession, quizController.deleteQuiz);
module.exports = router;
