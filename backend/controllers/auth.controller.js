const bcrypt = require('bcryptjs');
const User = require('../models/User');

const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  if (!/[a-zA-Z]/.test(email.split('@')[0])) return false;
  return true;
};

exports.signup = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format or missing characters before @' });
    }
    email = email.toLowerCase();

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      teacherId: req.body.teacherId || null
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    
    res.json({ message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.checkAuth = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ isAuthenticated: true, user: { id: req.session.userId, name: req.session.userName, role: req.session.userRole } });
  } else {
    res.json({ isAuthenticated: false });
  }
};
