const Result = require('../models/Result');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: array of selected option indices corresponding to questions
    const participantName = req.session.userName;

    if (!participantName) {
      return res.status(400).json({ message: 'Logged-in user name is required' });
    }

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
      participantName,
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

exports.getQuizResults = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Authorization: only the quiz creator can view its results
    if (quiz.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Unauthorized to view these results' });
    }

    const results = await Result.find({ quizId }).sort({ score: -1, submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
