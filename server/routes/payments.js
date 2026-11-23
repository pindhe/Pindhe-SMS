const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  generateReceipt,
} = require('../controllers/payments');

const router = express.Router();

router.route('/')
  .get(protect, getPayments)
  .post(protect, authorize('super_admin', 'school_admin'), createPayment);

router.route('/:id')
  .get(protect, getPayment)
  .put(protect, updatePayment)
  .delete(protect, authorize('super_admin', 'school_admin'), deletePayment);

router.get('/receipt/:id', protect, generateReceipt);

module.exports = router;