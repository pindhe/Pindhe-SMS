const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAttendance,
  markAttendance,
  getAttendanceStats,
  exportAttendance,
} = require('../controllers/attendance');

const router = express.Router();

router.route('/')
  .get(protect, getAttendance);

router.route('/mark')
  .post(protect, authorize('teacher', 'school_admin', 'super_admin'), markAttendance);

router.route('/stats')
  .get(protect, getAttendanceStats);

router.route('/export/csv')
  .get(protect, authorize('super_admin', 'school_admin'), exportAttendance);

module.exports = router;