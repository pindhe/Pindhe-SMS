const { SchoolSettings } = require('../models');

exports.getSettings = async (req, res) => {
  const settings = await SchoolSettings.getSettings();
  res.status(200).json({ success: true, data: settings });
};

exports.updateSettings = async (req, res) => {
  let settings = await SchoolSettings.findOne();
  if (!settings) {
    settings = await SchoolSettings.create(req.body);
  } else {
    await SchoolSettings.update(req.body, {
      where: { id: settings.id },
    });
    settings = await SchoolSettings.findByPk(settings.id);
  }
  res.status(200).json({ success: true, data: settings });
};