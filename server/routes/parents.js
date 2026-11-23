const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
} = require('../controllers/parents');

const router = express.Router();

router.route('/')
  .get(protect, getParents)
  .post(protect, authorize('super_admin', 'school_admin'), createParent);

router.route('/:id')
  .get(protect, getParent)
  .put(protect, updateParent)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteParent);

module.exports = router;