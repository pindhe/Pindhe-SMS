require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDB, sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const parentRoutes = require('./routes/parents');
const staffRoutes = require('./routes/staff');
const classRoutes = require('./routes/classes');
const sectionRoutes = require('./routes/sections');
const subjectRoutes = require('./routes/subjects');
const attendanceRoutes = require('./routes/attendance');
const teacherAttendanceRoutes = require('./routes/teacherAttendance');
const examinationRoutes = require('./routes/examinations');
const examResultRoutes = require('./routes/examResults');
const feeRoutes = require('./routes/fees');
const paymentRoutes = require('./routes/payments');
const timetableRoutes = require('./routes/timetables');
const eventRoutes = require('./routes/events');
const bookRoutes = require('./routes/books');
const bookTransactionRoutes = require('./routes/bookTransactions');
const announcementRoutes = require('./routes/announcements');
const expenseRoutes = require('./routes/expenses');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');

const app = express();

// Connect to MySQL
connectDB();

// Sync database models
sequelize.sync({ alter: false })
  .then(() => console.log('Database models synchronized.'))
  .catch((err) => console.error('Database sync error:', err));

// Trust proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Static files (for uploads)
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pindhe SMS API is running.', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/teacher-attendance', teacherAttendanceRoutes);
app.use('/api/examinations', examinationRoutes);
app.use('/api/exam-results', examResultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/book-transactions', bookTransactionRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;