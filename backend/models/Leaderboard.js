const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, unique: true },
  entries: [
    {
      participantName: { type: String, required: true },
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      percentage: { type: Number, required: true },
      achievedAt: { type: Date, default: Date.now }
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
