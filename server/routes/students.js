const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
} = require('../controllers/students');

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('super_admin', 'school_admin'), createStudent);

router.route('/:id')
  .get(protect, getStudent)
  .put(protect, updateStudent)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteStudent);

router.get('/export/csv', protect, authorize('super_admin', 'school_admin'), exportStudents);

module.exports = router;