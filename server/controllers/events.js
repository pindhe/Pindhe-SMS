const { Event, Class, User } = require('../models');

exports.getEvents = async (req, res) => {
  const { targetAudience, startDate, endDate, status } = req.query;
  let filter = {};
  if (targetAudience) filter.targetAudience = targetAudience;
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.startDate = { [require('sequelize').Op.gte]: new Date(startDate), [require('sequelize').Op.lte]: new Date(endDate) };
  }
  const events = await Event.findAll({
    where: filter,
    include: [
      { model: User, as: 'creator' },
      { model: Class, as: 'classes' },
    ],
  });
  res.status(200).json({ success: true, count: events.length, data: events });
};

exports.getEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    include: [
      { model: User, as: 'creator' },
      { model: Class, as: 'classes' },
    ],
  });
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.status(200).json({ success: true, data: event });
};

exports.createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: event });
};

exports.updateEvent = async (req, res) => {
  const [updated] = await Event.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  const event = await Event.findByPk(req.params.id);
  res.status(200).json({ success: true, data: event });
};

exports.deleteEvent = async (req, res) => {
  const deleted = await Event.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.status(200).json({ success: true, message: 'Event deleted' });
};