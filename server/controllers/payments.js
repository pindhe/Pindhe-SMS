const { Payment, Student, Fee, User } = require('../models');
const { Op } = require('sequelize');

exports.getPayments = async (req, res) => {
  const { student, paymentMethod, status } = req.query;
  let filter = {};
  if (student) filter.studentId = student;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (status) filter.status = status;
  const payments = await Payment.findAll({
    where: filter,
    include: [
      { model: Student, as: 'student' },
      { model: Fee, as: 'fee' },
    ],
  });
  res.status(200).json({ success: true, count: payments.length, data: payments });
};

exports.getPayment = async (req, res) => {
  const payment = await Payment.findByPk(req.params.id, {
    include: [
      { model: Student, as: 'student' },
      { model: Fee, as: 'fee' },
    ],
  });
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.status(200).json({ success: true, data: payment });
};

exports.createPayment = async (req, res) => {
  const receiptNumber = 'RCP-' + Date.now().toString(36).toUpperCase();
  const payment = await Payment.create({ ...req.body, receiptNumber });

  // Update fee status if linked
  if (req.body.feeId) {
    const fee = await Fee.findByPk(req.body.feeId);
    if (fee) {
      const totalPaid = await Payment.sum('amount', {
        where: { feeId: fee.id, status: 'completed' },
      });
      const paidAmount = totalPaid || 0;
      if (paidAmount >= fee.amount) {
        fee.status = 'paid';
      } else if (paidAmount > 0) {
        fee.status = 'partially_paid';
      }
      await fee.save();
    }
  }

  res.status(201).json({ success: true, data: payment });
};

exports.updatePayment = async (req, res) => {
  const [updated] = await Payment.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  const payment = await Payment.findByPk(req.params.id);
  res.status(200).json({ success: true, data: payment });
};

exports.deletePayment = async (req, res) => {
  const deleted = await Payment.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.status(200).json({ success: true, message: 'Payment deleted' });
};

exports.generateReceipt = async (req, res) => {
  const payment = await Payment.findByPk(req.params.id, {
    include: [{ model: Student, as: 'student' }],
  });
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.status(200).json({ success: true, data: { receiptNumber: payment.receiptNumber, ...payment.toJSON() } });
};