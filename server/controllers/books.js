const { Book } = require('../models');

exports.getBooks = async (req, res) => {
  const { category, status } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  const books = await Book.findAll({ where: filter });
  res.status(200).json({ success: true, count: books.length, data: books });
};

exports.getBook = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  res.status(200).json({ success: true, data: book });
};

exports.createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
};

exports.updateBook = async (req, res) => {
  const [updated] = await Book.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  const book = await Book.findByPk(req.params.id);
  res.status(200).json({ success: true, data: book });
};

exports.deleteBook = async (req, res) => {
  const deleted = await Book.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  res.status(200).json({ success: true, message: 'Book deleted' });
};