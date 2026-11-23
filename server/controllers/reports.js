const { Student, Teacher, Attendance, ExamResult, Payment, Fee, Class, Book, BookTransaction, Staff } = require('../models');
const { Op } = require('sequelize');

exports.getStudentReport = async (req, res) => {
  const { startDate, endDate, class: classId } = req.query;
  let filter = {};
  if (classId) filter.classId = classId;
  if (startDate && endDate) {
    filter.admissionDate = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const students = await Student.findAll({
    where: filter,
    include: [{ model: Class, as: 'class' }],
  });
  res.status(200).json({ success: true, count: students.length, data: students });
};

exports.getTeacherReport = async (req, res) => {
  const teachers = await Teacher.findAll({
    include: [
      { model: Class, as: 'assignedClasses' },
      { model: require('../models').Subject, as: 'assignedSubjects' },
    ],
  });
  res.status(200).json({ success: true, count: teachers.length, data: teachers });
};

exports.getAttendanceReport = async (req, res) => {
  const { startDate, endDate, class: classId } = req.query;
  let filter = {};
  if (classId) filter.classId = classId;
  if (startDate && endDate) {
    filter.date = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const attendance = await Attendance.findAll({
    where: filter,
    include: [{ model: Student, as: 'student' }, { model: Class, as: 'class' }],
  });
  res.status(200).json({ success: true, count: attendance.length, data: attendance });
};

exports.getExamReport = async (req, res) => {
  const { examination, class: classId } = req.query;
  let filter = {};
  if (examination) filter.examinationId = examination;
  if (classId) filter.classId = classId;
  const results = await ExamResult.findAll({
    where: filter,
    include: [
      { model: Student, as: 'student' },
      { model: require('../models').Subject, as: 'subject' },
      { model: require('../models').Examination, as: 'examination' },
    ],
  });
  res.status(200).json({ success: true, count: results.length, data: results });
};

exports.getFinancialReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  let filter = {};
  if (startDate && endDate) {
    filter.paymentDate = { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) };
  }
  const payments = await Payment.findAll({
    where: filter,
    include: [{ model: Student, as: 'student' }],
  });
  const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  res.status(200).json({ success: true, totalIncome, count: payments.length, data: payments });
};

exports.getFeeReport = async (req, res) => {
  const { status, class: classId } = req.query;
  let filter = {};
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

exports.getClassReport = async (req, res) => {
  const classes = await Class.findAll({
    include: [
      { model: Student, as: 'students' },
      { model: Teacher, as: 'classTeacher' },
    ],
  });
  res.status(200).json({ success: true, count: classes.length, data: classes });
};

exports.getLibraryReport = async (req, res) => {
  const books = await Book.findAll();
  const transactions = await BookTransaction.findAll({
    include: [{ model: Book, as: 'book' }],
  });
  res.status(200).json({ success: true, data: { books, transactions } });
};

exports.getStaffReport = async (req, res) => {
  const staff = await Staff.findAll();
  res.status(200).json({ success: true, count: staff.length, data: staff });
};

exports.exportReport = async (req, res) => {
  const { type, startDate, endDate } = req.query;
  res.status(200).json({ success: true, message: `Export ${type} report from ${startDate} to ${endDate}` });
};