const User = require('../models/User');
const Result = require('../models/Result');

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('name email _id');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyStudents = async (req, res) => {
  try {
    const teacherId = req.session.userId;
    // Find all users where teacherId matches and role is student
    const students = await User.find({ teacherId, role: 'student' }).select('-password');
    
    // Get analytics for each student
    const studentsWithAnalytics = await Promise.all(students.map(async (student) => {
      const results = await Result.find({ studentId: student._id });
      let totalQuizzes = results.length;
      let averageScore = 0;
      if (totalQuizzes > 0) {
        let totalPercentage = 0;
        for (let r of results) {
          totalPercentage += (r.score / r.totalQuestions) * 100;
        }
        averageScore = (totalPercentage / totalQuizzes).toFixed(2);
      }
      return {
        ...student.toObject(),
        totalQuizzes,
        averageScore
      };
    }));

    res.json(studentsWithAnalytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Verify that the student belongs to the requesting teacher
    const student = await User.findById(studentId);
    if (!student || student.teacherId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Unauthorized or student not found' });
    }

    const results = await Result.find({ studentId }).populate('quizId', 'title description quizCode').sort({ submittedAt: -1 });
    
    let totalQuizzes = results.length;
    let averageScore = 0;
    if (totalQuizzes > 0) {
      let totalPercentage = 0;
      for (let r of results) {
        totalPercentage += (r.score / r.totalQuestions) * 100;
      }
      averageScore = (totalPercentage / totalQuizzes).toFixed(2);
    }

    res.json({
      student: { name: student.name, email: student.email, _id: student._id },
      analytics: {
        totalQuizzes,
        averageScore,
        results
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyAnalytics = async (req, res) => {
  try {
    const studentId = req.session.userId;
    const results = await Result.find({ studentId, isHidden: { $ne: true } });
    
    let totalQuizzes = results.length;
    let averageScore = 0;
    if (totalQuizzes > 0) {
      let totalPercentage = 0;
      for (let r of results) {
        totalPercentage += (r.score / r.totalQuestions) * 100;
      }
      averageScore = (totalPercentage / totalQuizzes).toFixed(2);
    }

    res.json({
      totalQuizzes,
      averageScore
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
