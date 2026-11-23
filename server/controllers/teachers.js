const { Teacher } = require('../models');

exports.getTeachers = async (req, res) => {
  const teachers = await Teacher.findAll({
    include: [
      { model: require('../models').Class, as: 'assignedClasses' },
      { model: require('../models').Subject, as: 'assignedSubjects' },
    ],
  });
  res.status(200).json({ success: true, count: teachers.length, data: teachers });
};

exports.getTeacher = async (req, res) => {
  const teacher = await Teacher.findByPk(req.params.id, {
    include: [
      { model: require('../models').Class, as: 'assignedClasses' },
      { model: require('../models').Subject, as: 'assignedSubjects' },
    ],
  });
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }
  res.status(200).json({ success: true, data: teacher });
};

exports.createTeacher = async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json({ success: true, data: teacher });
};

exports.updateTeacher = async (req, res) => {
  const [updated] = await Teacher.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }
  const teacher = await Teacher.findByPk(req.params.id);
  res.status(200).json({ success: true, data: teacher });
};

exports.deleteTeacher = async (req, res) => {
  const deleted = await Teacher.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }
  res.status(200).json({ success: true, message: 'Teacher deleted' });
};