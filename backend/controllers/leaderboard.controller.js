const Leaderboard = require('../models/Leaderboard');
const Quiz = require('../models/Quiz');

exports.updateLeaderboard = async (quizId, participantName, score, totalQuestions) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const entry = { participantName, score, totalQuestions, percentage, achievedAt: new Date() };

  let board = await Leaderboard.findOne({ quizId });
  if (!board) {
    board = new Leaderboard({ quizId, entries: [entry] });
  } else {
    board.entries = board.entries.filter(e => e.participantName !== participantName);
    board.entries.push(entry);
    board.entries.sort((a, b) => b.score - a.score || b.percentage - a.percentage);
    board.entries = board.entries.slice(0, 20);
    board.lastUpdated = new Date();
  }
  await board.save();
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const board = await Leaderboard.findOne({ quizId });
    const entries = board ? board.entries : [];

    res.json({ quizTitle: quiz.title, entries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
