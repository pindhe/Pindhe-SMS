const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentReport,
  getTeacherReport,
  getAttendanceReport,
  getExamReport,
  getFinancialReport,
  getFeeReport,
  getClassReport,
  getLibraryReport,
  getStaffReport,
  exportReport,
} = require('../controllers/reports');

const router = express.Router();

router.route('/students').get(protect, authorize('super_admin', 'school_admin'), getStudentReport);
router.route('/teachers').get(protect, authorize('super_admin', 'school_admin'), getTeacherReport);
router.route('/attendance').get(protect, getAttendanceReport);
router.route('/exams').get(protect, getExamReport);
router.route('/financial').get(protect, authorize('super_admin', 'school_admin'), getFinancialReport);
router.route('/fees').get(protect, authorize('super_admin', 'school_admin'), getFeeReport);
router.route('/classes').get(protect, getClassReport);
router.route('/library').get(protect, getLibraryReport);
router.route('/staff').get(protect, authorize('super_admin', 'school_admin'), getStaffReport);
router.route('/export').get(protect, exportReport);

module.exports = router;