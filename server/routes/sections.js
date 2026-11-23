const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
} = require('../controllers/sections');

const router = express.Router();

router.route('/')
  .get(protect, getSections)
  .post(protect, authorize('super_admin', 'school_admin'), createSection);

router.route('/:id')
  .get(protect, getSection)
  .put(protect, updateSection)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteSection);

module.exports = router;