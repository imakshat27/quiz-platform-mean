const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  participantName: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }], // The index of the selected option
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
