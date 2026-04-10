const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  quizCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null }, // Mapped to Class
  testType: { type: String, enum: ['instant', 'scheduled'], default: 'instant' },
  scheduledFor: { type: Date },
  scheduledEndTime: { type: Date },
  durationMinutes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
