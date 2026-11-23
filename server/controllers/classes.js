const { Class } = require('../models');

exports.getClasses = async (req, res) => {
  const classes = await Class.findAll({
    include: [
      { model: require('../models').Teacher, as: 'classTeacher' },
      { model: require('../models').Subject, as: 'subjects' },
      { model: require('../models').Student, as: 'students' },
    ],
  });
  res.status(200).json({ success: true, count: classes.length, data: classes });
};

exports.getClass = async (req, res) => {
  const classItem = await Class.findByPk(req.params.id, {
    include: [
      { model: require('../models').Teacher, as: 'classTeacher' },
      { model: require('../models').Subject, as: 'subjects' },
      { model: require('../models').Student, as: 'students' },
    ],
  });
  if (!classItem) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }
  res.status(200).json({ success: true, data: classItem });
};

exports.createClass = async (req, res) => {
  const classItem = await Class.create(req.body);
  res.status(201).json({ success: true, data: classItem });
};

exports.updateClass = async (req, res) => {
  const [updated] = await Class.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }
  const classItem = await Class.findByPk(req.params.id);
  res.status(200).json({ success: true, data: classItem });
};

exports.deleteClass = async (req, res) => {
  const deleted = await Class.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }
  res.status(200).json({ success: true, message: 'Class deleted' });
};