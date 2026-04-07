const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');
const { checkSession } = require('../middleware/auth.middleware');

router.get('/:quizId', checkSession, leaderboardController.getLeaderboard);

module.exports = router;
