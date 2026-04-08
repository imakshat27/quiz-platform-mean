const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

exports.addQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }


    if (quiz.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You are not authorized to add questions to this quiz' });
    }

    const newQuestion = new Question({
      quizId,
      questionText,
      options,
      correctAnswer
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuestionsByQuizId = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
