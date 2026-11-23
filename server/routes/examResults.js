const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getExamResults,
  getExamResult,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  calculateGrades,
  exportResults,
} = require('../controllers/examResults');

const router = express.Router();

router.route('/')
  .get(protect, getExamResults)
  .post(protect, authorize('teacher', 'school_admin', 'super_admin'), createExamResult);

router.route('/:id')
  .get(protect, getExamResult)
  .put(protect, updateExamResult)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteExamResult);

router.put('/calculate-grades', protect, authorize('school_admin', 'super_admin'), calculateGrades);
router.get('/export/csv', protect, authorize('super_admin', 'school_admin'), exportResults);

module.exports = router;