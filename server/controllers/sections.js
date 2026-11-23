const { Section } = require('../models');

exports.getSections = async (req, res) => {
  const sections = await Section.findAll({
    include: [
      { model: require('../models').Class, as: 'class' },
      { model: require('../models').Teacher, as: 'classTeacher' },
    ],
  });
  res.status(200).json({ success: true, count: sections.length, data: sections });
};

exports.getSection = async (req, res) => {
  const section = await Section.findByPk(req.params.id, {
    include: [
      { model: require('../models').Class, as: 'class' },
      { model: require('../models').Teacher, as: 'classTeacher' },
    ],
  });
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.status(200).json({ success: true, data: section });
};

exports.createSection = async (req, res) => {
  const section = await Section.create(req.body);
  res.status(201).json({ success: true, data: section });
};

exports.updateSection = async (req, res) => {
  const [updated] = await Section.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  const section = await Section.findByPk(req.params.id);
  res.status(200).json({ success: true, data: section });
};

exports.deleteSection = async (req, res) => {
  const deleted = await Section.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.status(200).json({ success: true, message: 'Section deleted' });
};