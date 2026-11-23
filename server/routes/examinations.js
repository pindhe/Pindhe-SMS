const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getExaminations,
  getExamination,
  createExamination,
  updateExamination,
  deleteExamination,
} = require('../controllers/examinations');

const router = express.Router();

router.route('/')
  .get(protect, getExaminations)
  .post(protect, authorize('super_admin', 'school_admin'), createExamination);

router.route('/:id')
  .get(protect, getExamination)
  .put(protect, authorize('super_admin', 'school_admin'), updateExamination)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteExamination);

module.exports = router;