const { Attendance, Student, Class, Section, Teacher } = require('../models');
const { Op } = require('sequelize');

exports.getAttendance = async (req, res) => {
  const { class: classId, section, date, startDate, endDate, student } = req.query;
  let filter = {};
  if (classId) filter.classId = classId;
  if (section) filter.sectionId = section;
  if (student) filter.studentId = student;
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  } else if (date) {
    filter.date = new Date(date);
  }
  const attendance = await Attendance.findAll({
    where: filter,
    include: [
      { model: Student, as: 'student' },
      { model: Class, as: 'class' },
      { model: Section, as: 'section' },
      { model: Teacher, as: 'markedByTeacher' },
    ],
  });
  res.status(200).json({ success: true, count: attendance.length, data: attendance });
};

exports.markAttendance = async (req, res) => {
  const { records } = req.body;
  const results = [];
  for (const record of records) {
    const [attendance, created] = await Attendance.findOrCreate({
      where: { studentId: record.studentId, date: record.date },
      defaults: { ...record, markedBy: req.user.id },
    });
    if (!created) {
      await Attendance.update({ ...record, markedBy: req.user.id }, {
        where: { studentId: record.studentId, date: record.date },
      });
    }
    results.push(await Attendance.findOne({ where: { studentId: record.studentId, date: record.date } }));
  }
  res.status(200).json({ success: true, data: results });
};

exports.getAttendanceStats = async (req, res) => {
  const { class: classId, startDate, endDate } = req.query;
  let filter = {};
  if (classId) filter.classId = classId;
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const attendance = await Attendance.findAll({ where: filter });
  const stats = attendance.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const statsArray = Object.entries(stats).map(([status, count]) => ({ _id: status, count }));
  res.status(200).json({ success: true, data: statsArray });
};

exports.exportAttendance = async (req, res) => {
  const attendance = await Attendance.findAll({
    include: [{ model: Student, as: 'student' }, { model: Class, as: 'class' }],
  });
  res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
  res.setHeader('Content-Type', 'text/csv');
  const headers = ['Date', 'Student ID', 'Student Name', 'Class', 'Status'];
  let csv = headers.join(',') + '\n';
  attendance.forEach((a) => {
    csv += `${a.date},${a.student ? a.student.studentId : ''},${a.student ? a.student.firstName + ' ' + a.student.lastName : ''},${a.class ? a.class.name : ''},${a.status}\n`;
  });
  res.send(csv);
};