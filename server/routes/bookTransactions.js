const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getBookTransactions,
  getBookTransaction,
  createBookTransaction,
  returnBook,
} = require('../controllers/bookTransactions');

const router = express.Router();

router.route('/')
  .get(protect, getBookTransactions)
  .post(protect, authorize('librarian', 'teacher', 'school_admin', 'super_admin'), createBookTransaction);

router.route('/:id')
  .get(protect, getBookTransaction)
  .put(protect, returnBook);

module.exports = router;