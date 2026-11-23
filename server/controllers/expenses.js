const { Expense, User } = require('../models');
const { Op } = require('sequelize');

exports.getExpenses = async (req, res) => {
  const { category, startDate, endDate } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const expenses = await Expense.findAll({
    where: filter,
    include: [{ model: User, as: 'recorder' }],
  });
  res.status(200).json({ success: true, count: expenses.length, data: expenses });
};

exports.getExpense = async (req, res) => {
  const expense = await Expense.findByPk(req.params.id, {
    include: [{ model: User, as: 'recorder' }],
  });
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }
  res.status(200).json({ success: true, data: expense });
};

exports.createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, recordedBy: req.user.id });
  res.status(201).json({ success: true, data: expense });
};

exports.updateExpense = async (req, res) => {
  const [updated] = await Expense.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }
  const expense = await Expense.findByPk(req.params.id);
  res.status(200).json({ success: true, data: expense });
};

exports.deleteExpense = async (req, res) => {
  const deleted = await Expense.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }
  res.status(200).json({ success: true, message: 'Expense deleted' });
};