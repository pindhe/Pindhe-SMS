const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} = require('../controllers/classes');

const router = express.Router();

router.route('/')
  .get(protect, getClasses)
  .post(protect, authorize('super_admin', 'school_admin'), createClass);

router.route('/:id')
  .get(protect, getClass)
  .put(protect, updateClass)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteClass);

module.exports = router;