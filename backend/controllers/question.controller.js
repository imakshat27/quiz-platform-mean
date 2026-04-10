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

exports.editQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const quiz = await Quiz.findById(question.quizId);
    if (!quiz || quiz.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this question' });
    }
    
    question.questionText = questionText;
    question.options = options;
    question.correctAnswer = correctAnswer;
    await question.save();
    
    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const quiz = await Quiz.findById(question.quizId);
    if (!quiz || quiz.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
