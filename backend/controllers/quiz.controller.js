const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, classId, testType, scheduledFor, scheduledEndTime, durationMinutes } = req.body;
    const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newQuiz = new Quiz({
      title,
      description,
      testType: testType || 'instant',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime) : null,
      durationMinutes: durationMinutes || 0,
      quizCode,
      classId: classId || null,
      createdBy: req.session.userId
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: savedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.session.userId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
  
    const questionCount = await Question.countDocuments({ quizId: quiz._id });

    const quizData = quiz.toObject();
    quizData.questionCount = questionCount;

    res.json(quizData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuizByCode = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizCode: req.params.code.toUpperCase() });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found. Please check the code.' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.session.userId;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this quiz' });
    }

    await Question.deleteMany({ quizId: quiz._id });
    
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAssignedQuizzes = async (req, res) => {
  try {
    const studentId = req.session.userId;
    // Find classes this student is part of
    const Class = require('../models/Class');
    const classes = await Class.find({ students: studentId });
    const classIds = classes.map(c => c._id);

    // Fetch quizzes assigned to these classes
    const quizzes = await Quiz.find({ classId: { $in: classIds } }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEligibility = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizCode: req.params.code.toUpperCase() }).populate('createdBy', 'name');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const Result = require('../models/Result');
    const Question = require('../models/Question');
    const questionCount = await Question.countDocuments({ quizId: quiz._id });

    let canAttempt = true;
    let reason = null;

    const existingResult = await Result.findOne({ studentId: req.session.userId, quizId: quiz._id });
    if (existingResult) {
      canAttempt = false;
      reason = 'Already Attempted';
    } else if (quiz.testType === 'scheduled') {
      const now = new Date();
      if (quiz.scheduledFor && now < quiz.scheduledFor) {
        canAttempt = false;
        reason = 'Not Started Yet';
      } else if (quiz.scheduledEndTime && now > quiz.scheduledEndTime) {
        canAttempt = false;
        reason = 'Quiz Deadline Passed';
      }
    }

    const quizData = quiz.toObject();
    quizData.questionCount = questionCount;

    res.json({
      canAttempt,
      reason,
      quizInfo: quizData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
