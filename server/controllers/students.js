const { Student } = require('../models');

exports.getStudents = async (req, res) => {
  const students = await Student.findAll({
    include: [{ model: require('../models').Class }, { model: require('../models').Section }],
  });
  res.status(200).json({ success: true, count: students.length, data: students });
};

exports.getStudent = async (req, res) => {
  const student = await Student.findByPk(req.params.id, {
    include: [{ model: require('../models').Class }, { model: require('../models').Section }],
  });
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.status(200).json({ success: true, data: student });
};

exports.createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
};

exports.updateStudent = async (req, res) => {
  const [updated] = await Student.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  const student = await Student.findByPk(req.params.id);
  res.status(200).json({ success: true, data: student });
};

exports.deleteStudent = async (req, res) => {
  const deleted = await Student.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.status(200).json({ success: true, message: 'Student deleted' });
};

exports.exportStudents = async (req, res) => {
  const students = await Student.findAll({
    include: [{ model: require('../models').Class }, { model: require('../models').Section }],
  });
  res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
  res.setHeader('Content-Type', 'text/csv');
  const headers = ['Student ID', 'Name', 'Class', 'Section', 'Email', 'Phone', 'Status'];
  let csv = headers.join(',') + '\n';
  students.forEach((s) => {
    csv += `${s.studentId},${s.firstName} ${s.lastName},${s.class ? s.class.name : ''},${s.section ? s.section.name : ''},${s.parentEmail || ''},${s.phone || ''},${s.status}\n`;
  });
  res.send(csv);
};