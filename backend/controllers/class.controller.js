const Class = require('../models/Class');
const User = require('../models/User');

exports.createClass = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newClass = new Class({
      name,
      classCode,
      teacherId: req.session.userId,
      students: []
    });

    const savedClass = await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: savedClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;
    if (!classCode) {
      return res.status(400).json({ message: 'Class code is required' });
    }

    const targetClass = await Class.findOne({ classCode: classCode.toUpperCase() });
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (targetClass.students.includes(req.session.userId)) {
      return res.status(400).json({ message: 'You are already enrolled in this class' });
    }

    targetClass.students.push(req.session.userId);
    await targetClass.save();

    res.json({ message: 'Joined class successfully', class: targetClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacherId: req.session.userId }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    const classes = await Class.find({ students: req.session.userId })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    const classId = req.params.id;
    const targetClass = await Class.findById(classId).populate('students', 'name email createdAt');
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (targetClass.teacherId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Unauthorized. You are not the teacher of this class' });
    }

    res.json(targetClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { studentId } = req.body;
    const sessionUserId = req.session.userId;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Verify Authorization: caller must be the student or the class teacher
    if (sessionUserId !== studentId && targetClass.teacherId.toString() !== sessionUserId) {
      return res.status(403).json({ message: 'Unauthorized to remove this student' });
    }

    // Remove the student using $pull
    targetClass.students.pull(studentId);
    await targetClass.save();

    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
