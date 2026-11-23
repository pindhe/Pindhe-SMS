const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjects');

const router = express.Router();

router.route('/')
  .get(protect, getSubjects)
  .post(protect, authorize('super_admin', 'school_admin'), createSubject);

router.route('/:id')
  .get(protect, getSubject)
  .put(protect, updateSubject)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteSubject);

module.exports = router;