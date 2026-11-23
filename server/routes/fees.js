const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
} = require('../controllers/fees');

const router = express.Router();

router.route('/')
  .get(protect, getFees)
  .post(protect, authorize('super_admin', 'school_admin'), createFee);

router.route('/:id')
  .get(protect, getFee)
  .put(protect, updateFee)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteFee);

module.exports = router;