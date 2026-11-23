const { Staff } = require('../models');

exports.getStaff = async (req, res) => {
  const staff = await Staff.findAll();
  res.status(200).json({ success: true, count: staff.length, data: staff });
};

exports.getStaffMember = async (req, res) => {
  const staffMember = await Staff.findByPk(req.params.id);
  if (!staffMember) {
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }
  res.status(200).json({ success: true, data: staffMember });
};

exports.createStaff = async (req, res) => {
  const staffMember = await Staff.create(req.body);
  res.status(201).json({ success: true, data: staffMember });
};

exports.updateStaff = async (req, res) => {
  const [updated] = await Staff.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }
  const staffMember = await Staff.findByPk(req.params.id);
  res.status(200).json({ success: true, data: staffMember });
};

exports.deleteStaff = async (req, res) => {
  const deleted = await Staff.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }
  res.status(200).json({ success: true, message: 'Staff deleted' });
};