const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staff');

const router = express.Router();

router.route('/')
  .get(protect, getStaff)
  .post(protect, authorize('super_admin', 'school_admin'), createStaff);

router.route('/:id')
  .get(protect, getStaffMember)
  .put(protect, updateStaff)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteStaff);

module.exports = router;