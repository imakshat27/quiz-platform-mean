const Result = require('../models/Result');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: array of selected option indices corresponding to questions

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Get all questions to evaluate the score
    const questions = await Question.find({ quizId });
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'Quiz has no questions' });
    }

    let score = 0;
    const totalQuestions = questions.length;

    // Compare answers with correctAnswer
    for (let i = 0; i < questions.length; i++) {
       // answers[i] is the user's selected index. It might be null/undefined if skipped.
       if (answers[i] === questions[i].correctAnswer) {
         score += 1;
       }
    }

    // Store result
    const newResult = new Result({
      userId: req.session.userId,
      quizId,
      answers,
      score,
      totalQuestions
    });

    await newResult.save();

    res.status(201).json({ message: 'Quiz submitted successfully', result: newResult });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.session.userId })
                                .populate('quizId', 'title description')
                                .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
