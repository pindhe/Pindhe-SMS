const { Timetable, Class, Section, Subject, Teacher } = require('../models');

exports.getTimetables = async (req, res) => {
  const { class: classId, section, day, teacher } = req.query;
  let filter = {};
  if (classId) filter.classId = classId;
  if (section) filter.sectionId = section;
  if (day) filter.day = day;
  if (teacher) filter.teacherId = teacher;
  const timetables = await Timetable.findAll({
    where: filter,
    include: [
      { model: Class, as: 'class' },
      { model: Section, as: 'section' },
      { model: Subject, as: 'subject' },
      { model: Teacher, as: 'teacher' },
    ],
  });
  res.status(200).json({ success: true, count: timetables.length, data: timetables });
};

exports.getTimetable = async (req, res) => {
  const timetable = await Timetable.findByPk(req.params.id, {
    include: [
      { model: Class, as: 'class' },
      { model: Section, as: 'section' },
      { model: Subject, as: 'subject' },
      { model: Teacher, as: 'teacher' },
    ],
  });
  if (!timetable) {
    return res.status(404).json({ success: false, message: 'Timetable entry not found' });
  }
  res.status(200).json({ success: true, data: timetable });
};

exports.createTimetable = async (req, res) => {
  const timetable = await Timetable.create(req.body);
  res.status(201).json({ success: true, data: timetable });
};

exports.updateTimetable = async (req, res) => {
  const [updated] = await Timetable.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Timetable entry not found' });
  }
  const timetable = await Timetable.findByPk(req.params.id);
  res.status(200).json({ success: true, data: timetable });
};

exports.deleteTimetable = async (req, res) => {
  const deleted = await Timetable.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Timetable entry not found' });
  }
  res.status(200).json({ success: true, message: 'Timetable entry deleted' });
};