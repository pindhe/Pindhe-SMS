const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teachers');

const router = express.Router();

router.route('/')
  .get(protect, getTeachers)
  .post(protect, authorize('super_admin', 'school_admin'), createTeacher);

router.route('/:id')
  .get(protect, getTeacher)
  .put(protect, updateTeacher)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteTeacher);

module.exports = router;