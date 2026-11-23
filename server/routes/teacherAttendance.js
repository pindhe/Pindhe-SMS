const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getTeacherAttendance,
  markTeacherAttendance,
  getTeacherAttendanceStats,
} = require('../controllers/teacherAttendance');

const router = express.Router();

router.route('/')
  .get(protect, getTeacherAttendance);

router.route('/mark')
  .post(protect, authorize('school_admin', 'super_admin'), markTeacherAttendance);

router.route('/stats')
  .get(protect, getTeacherAttendanceStats);

module.exports = router;