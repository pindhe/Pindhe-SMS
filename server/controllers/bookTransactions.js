const { BookTransaction, Book } = require('../models');

exports.getBookTransactions = async (req, res) => {
  const { borrowerType, borrowerId, status } = req.query;
  let filter = {};
  if (borrowerType) filter.borrowerType = borrowerType;
  if (borrowerId) filter.borrowerId = borrowerId;
  if (status) filter.status = status;
  const transactions = await BookTransaction.findAll({
    where: filter,
    include: [{ model: Book, as: 'book' }],
  });
  res.status(200).json({ success: true, count: transactions.length, data: transactions });
};

exports.getBookTransaction = async (req, res) => {
  const transaction = await BookTransaction.findByPk(req.params.id, {
    include: [{ model: Book, as: 'book' }],
  });
  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }
  res.status(200).json({ success: true, data: transaction });
};

exports.createBookTransaction = async (req, res) => {
  const book = await Book.findByPk(req.body.bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  if (book.availableQuantity <= 0) {
    return res.status(400).json({ success: false, message: 'Book not available' });
  }

  book.availableQuantity -= 1;
  await book.save();

  const transaction = await BookTransaction.create(req.body);
  res.status(201).json({ success: true, data: transaction });
};

exports.returnBook = async (req, res) => {
  const transaction = await BookTransaction.findByPk(req.params.id);
  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  if (transaction.status === 'returned') {
    return res.status(400).json({ success: false, message: 'Book already returned' });
  }

  transaction.status = 'returned';
  transaction.returnDate = new Date();
  await transaction.save();

  const book = await Book.findByPk(transaction.bookId);
  if (book) {
    book.availableQuantity += 1;
    await book.save();
  }

  res.status(200).json({ success: true, data: transaction });
};