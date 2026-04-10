const User = require('../models/User');
const Result = require('../models/Result');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
    
    const Class = require('../models/Class');
    const teacherClasses = await Class.find({ teacherId });

    
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
      // Find which classes the student belongs to
      const studentClasses = teacherClasses
        .filter(c => c.students.includes(student._id))
        .map(c => c.name);

      const classesString = studentClasses.length > 0 ? studentClasses.join(', ') : 'Unassigned';

      return {
        ...student.toObject(),
        totalQuizzes,
        averageScore,
        className: classesString
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
