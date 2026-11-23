const { TeacherAttendance, Teacher, Staff } = require('../models');
const { Op } = require('sequelize');

exports.getTeacherAttendance = async (req, res) => {
  const { teacher, date, startDate, endDate } = req.query;
  let filter = {};
  if (teacher) filter.teacherId = teacher;
  if (date) filter.date = new Date(date);
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const attendance = await TeacherAttendance.findAll({
    where: filter,
    include: [{ model: Teacher, as: 'teacher' }],
  });
  res.status(200).json({ success: true, count: attendance.length, data: attendance });
};

exports.markTeacherAttendance = async (req, res) => {
  const { records } = req.body;
  const results = [];
  for (const record of records) {
    const [attendance, created] = await TeacherAttendance.findOrCreate({
      where: { teacherId: record.teacherId, date: record.date },
      defaults: { ...record },
    });
    if (!created) {
      await TeacherAttendance.update({ ...record }, {
        where: { teacherId: record.teacherId, date: record.date },
      });
    }
    results.push(await TeacherAttendance.findOne({ where: { teacherId: record.teacherId, date: record.date } }));
  }
  res.status(200).json({ success: true, data: results });
};

exports.getTeacherAttendanceStats = async (req, res) => {
  const { startDate, endDate } = req.query;
  let filter = {};
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const attendance = await TeacherAttendance.findAll({ where: filter });
  const stats = attendance.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const statsArray = Object.entries(stats).map(([status, count]) => ({ _id: status, count }));
  res.status(200).json({ success: true, data: statsArray });
};