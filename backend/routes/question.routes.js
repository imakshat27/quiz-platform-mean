const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.post('/add-question', checkSession, questionController.addQuestion);
router.get('/questions/:quizId', checkSession, questionController.getQuestionsByQuizId);
router.put('/question/:id', checkSession, questionController.editQuestion);
router.delete('/question/:id', checkSession, questionController.deleteQuestion);

module.exports = router;
