const { Announcement, Class, User } = require('../models');

exports.getAnnouncements = async (req, res) => {
  const { targetAudience, status, classes } = req.query;
  let filter = {};
  if (targetAudience) filter.targetAudience = targetAudience;
  if (status) filter.status = status;
  const announcements = await Announcement.findAll({
    where: filter,
    include: [
      { model: User, as: 'creator' },
      { model: Class, as: 'classes' },
    ],
  });
  res.status(200).json({ success: true, count: announcements.length, data: announcements });
};

exports.getAnnouncement = async (req, res) => {
  const announcement = await Announcement.findByPk(req.params.id, {
    include: [
      { model: User, as: 'creator' },
      { model: Class, as: 'classes' },
    ],
  });
  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  res.status(200).json({ success: true, data: announcement });
};

exports.createAnnouncement = async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: announcement });
};

exports.updateAnnouncement = async (req, res) => {
  const [updated] = await Announcement.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  const announcement = await Announcement.findByPk(req.params.id);
  res.status(200).json({ success: true, data: announcement });
};

exports.deleteAnnouncement = async (req, res) => {
  const deleted = await Announcement.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  res.status(200).json({ success: true, message: 'Announcement deleted' });
};