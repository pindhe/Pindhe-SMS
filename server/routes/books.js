const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/books');

const router = express.Router();

router.route('/')
  .get(protect, getBooks)
  .post(protect, authorize('super_admin', 'school_admin'), createBook);

router.route('/:id')
  .get(protect, getBook)
  .put(protect, updateBook)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteBook);

module.exports = router;