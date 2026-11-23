const { Parent } = require('../models');

exports.getParents = async (req, res) => {
  const parents = await Parent.findAll({
    include: [{ model: require('../models').Student, as: 'children' }],
  });
  res.status(200).json({ success: true, count: parents.length, data: parents });
};

exports.getParent = async (req, res) => {
  const parent = await Parent.findByPk(req.params.id, {
    include: [{ model: require('../models').Student, as: 'children' }],
  });
  if (!parent) {
    return res.status(404).json({ success: false, message: 'Parent not found' });
  }
  res.status(200).json({ success: true, data: parent });
};

exports.createParent = async (req, res) => {
  const parent = await Parent.create(req.body);
  res.status(201).json({ success: true, data: parent });
};

exports.updateParent = async (req, res) => {
  const [updated] = await Parent.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Parent not found' });
  }
  const parent = await Parent.findByPk(req.params.id);
  res.status(200).json({ success: true, data: parent });
};

exports.deleteParent = async (req, res) => {
  const deleted = await Parent.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Parent not found' });
  }
  res.status(200).json({ success: true, message: 'Parent deleted' });
};