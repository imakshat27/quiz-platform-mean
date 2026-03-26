const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const resultRoutes = require('./routes/result.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration
app.use(cors({
  origin: 'http://localhost:4200', // Angular app origin
  credentials: true // Allow sending cookies/session
}));

// Session configuration
app.use(session({
  secret: 'simple_quiz_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Database Connection
const MONGODB_URI = "mongodb://localhost:27017/quizSystem";
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB locally'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/result', resultRoutes);

// Export app for testing or start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
