const { Examination, Class, Subject, User } = require('../models');

exports.getExaminations = async (req, res) => {
  const exams = await Examination.findAll({
    include: [
      { model: Class, as: 'classes' },
      { model: Subject, as: 'subjects' },
      { model: User, as: 'creator' },
    ],
  });
  res.status(200).json({ success: true, count: exams.length, data: exams });
};

exports.getExamination = async (req, res) => {
  const exam = await Examination.findByPk(req.params.id, {
    include: [
      { model: Class, as: 'classes' },
      { model: Subject, as: 'subjects' },
      { model: User, as: 'creator' },
    ],
  });
  if (!exam) {
    return res.status(404).json({ success: false, message: 'Examination not found' });
  }
  res.status(200).json({ success: true, data: exam });
};

exports.createExamination = async (req, res) => {
  const exam = await Examination.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: exam });
};

exports.updateExamination = async (req, res) => {
  const [updated] = await Examination.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Examination not found' });
  }
  const exam = await Examination.findByPk(req.params.id);
  res.status(200).json({ success: true, data: exam });
};

exports.deleteExamination = async (req, res) => {
  const deleted = await Examination.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Examination not found' });
  }
  res.status(200).json({ success: true, message: 'Examination deleted' });
};