const { Subject } = require('../models');

exports.getSubjects = async (req, res) => {
  const subjects = await Subject.findAll({
    include: [
      { model: require('../models').Class, as: 'classes' },
      { model: require('../models').Teacher, as: 'teachers' },
    ],
  });
  res.status(200).json({ success: true, count: subjects.length, data: subjects });
};

exports.getSubject = async (req, res) => {
  const subject = await Subject.findByPk(req.params.id, {
    include: [
      { model: require('../models').Class, as: 'classes' },
      { model: require('../models').Teacher, as: 'teachers' },
    ],
  });
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.status(200).json({ success: true, data: subject });
};

exports.createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
};

exports.updateSubject = async (req, res) => {
  const [updated] = await Subject.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  const subject = await Subject.findByPk(req.params.id);
  res.status(200).json({ success: true, data: subject });
};

exports.deleteSubject = async (req, res) => {
  const deleted = await Subject.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.status(200).json({ success: true, message: 'Subject deleted' });
};