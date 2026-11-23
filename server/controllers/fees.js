const { Fee, Student, Class, User } = require('../models');

exports.getFees = async (req, res) => {
  const { student, status, class: classId } = req.query;
  let filter = {};
  if (student) filter.studentId = student;
  if (status) filter.status = status;
  if (classId) filter.classId = classId;
  const fees = await Fee.findAll({
    where: filter,
    include: [
      { model: Student, as: 'student' },
      { model: Class, as: 'class' },
    ],
  });
  res.status(200).json({ success: true, count: fees.length, data: fees });
};

exports.getFee = async (req, res) => {
  const fee = await Fee.findByPk(req.params.id, {
    include: [
      { model: Student, as: 'student' },
      { model: Class, as: 'class' },
    ],
  });
  if (!fee) {
    return res.status(404).json({ success: false, message: 'Fee not found' });
  }
  res.status(200).json({ success: true, data: fee });
};

exports.createFee = async (req, res) => {
  const fee = await Fee.create(req.body);
  res.status(201).json({ success: true, data: fee });
};

exports.updateFee = async (req, res) => {
  const [updated] = await Fee.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Fee not found' });
  }
  const fee = await Fee.findByPk(req.params.id);
  res.status(200).json({ success: true, data: fee });
};

exports.deleteFee = async (req, res) => {
  const deleted = await Fee.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Fee not found' });
  }
  res.status(200).json({ success: true, message: 'Fee deleted' });
};