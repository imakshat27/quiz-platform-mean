const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newQuiz = new Quiz({
      title,
      description,
      quizCode,
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
    
    // Also fetch the questions count for this quiz
    const questionCount = await Question.countDocuments({ quizId: quiz._id });
    
    // Convert to plain object to attach custom fields
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

    // Delete associated questions
    await Question.deleteMany({ quizId: quiz._id });
    
    // Using findByIdAndDelete instead of quiz.remove() which is deprecated
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
