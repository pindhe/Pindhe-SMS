const { ExamResult, Student, Subject, Class, Examination, Teacher } = require('../models');
const { Op } = require('sequelize');

exports.getExamResults = async (req, res) => {
  const { examination, student, subject, class: classId } = req.query;
  let filter = {};
  if (examination) filter.examinationId = examination;
  if (student) filter.studentId = student;
  if (subject) filter.subjectId = subject;
  if (classId) filter.classId = classId;
  const results = await ExamResult.findAll({
    where: filter,
    include: [
      { model: Student, as: 'student' },
      { model: Subject, as: 'subject' },
      { model: Class, as: 'class' },
      { model: Examination, as: 'examination' },
    ],
  });
  res.status(200).json({ success: true, count: results.length, data: results });
};

exports.getExamResult = async (req, res) => {
  const result = await ExamResult.findByPk(req.params.id, {
    include: [
      { model: Student, as: 'student' },
      { model: Subject, as: 'subject' },
      { model: Class, as: 'class' },
      { model: Examination, as: 'examination' },
    ],
  });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Result not found' });
  }
  res.status(200).json({ success: true, data: result });
};

exports.createExamResult = async (req, res) => {
  const result = await ExamResult.create({ ...req.body, enteredBy: req.user.id });
  res.status(201).json({ success: true, data: result });
};

exports.updateExamResult = async (req, res) => {
  const [updated] = await ExamResult.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Result not found' });
  }
  const result = await ExamResult.findByPk(req.params.id);
  res.status(200).json({ success: true, data: result });
};

exports.deleteExamResult = async (req, res) => {
  const deleted = await ExamResult.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Result not found' });
  }
  res.status(200).json({ success: true, message: 'Result deleted' });
};

exports.calculateGrades = async (req, res) => {
  const SchoolSettings = require('../models').SchoolSettings;
  const settings = await SchoolSettings.getSettings();
  const gradingSystem = settings.gradingSystem || {
    A: '90-100', B: '80-89', C: '70-79', D: '60-69', E: '50-59', F: 'Below 50',
  };

  const results = await ExamResult.findAll();
  for (const result of results) {
    const percentage = (result.marksObtained / result.maxMarks) * 100;
    result.percentage = percentage;

    let grade = 'F';
    for (const [gradeName, range] of Object.entries(gradingSystem)) {
      const [min, max] = range.split('-').map(Number);
      if (max) {
        if (percentage >= min && percentage <= max) {
          grade = gradeName;
          break;
        }
      } else {
        if (percentage < min) {
          grade = gradeName;
          break;
        }
      }
    }
    result.grade = grade;
    await result.save();
  }
  res.status(200).json({ success: true, data: results });
};

exports.exportResults = async (req, res) => {
  const results = await ExamResult.findAll({
    include: [
      { model: Student, as: 'student' },
      { model: Subject, as: 'subject' },
      { model: Examination, as: 'examination' },
    ],
  });
  res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
  res.setHeader('Content-Type', 'text/csv');
  const headers = ['Student ID', 'Student Name', 'Subject', 'Marks', 'Max Marks', 'Percentage', 'Grade'];
  let csv = headers.join(',') + '\n';
  results.forEach((r) => {
    csv += `${r.student ? r.student.studentId : ''},${r.student ? r.student.firstName + ' ' + r.student.lastName : ''},${r.subject ? r.subject.name : ''},${r.marksObtained},${r.maxMarks},${r.percentage || ''},${r.grade || ''}\n`;
  });
  res.send(csv);
};