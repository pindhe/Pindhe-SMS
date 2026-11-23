const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenses');

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, authorize('super_admin', 'school_admin'), createExpense);

router.route('/:id')
  .get(protect, getExpense)
  .put(protect, updateExpense)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteExpense);

module.exports = router;