const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newQuiz = new Quiz({
      title,
      description,
      createdBy: req.session.userId
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: savedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
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
