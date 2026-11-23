const { User } = require('../models');

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({ success: true, count: users.length, data: users });
};

exports.getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, data: user });
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

exports.updateUser = async (req, res) => {
  const [updated] = await User.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const user = await User.findByPk(req.params.id);
  res.status(200).json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  const deleted = await User.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, message: 'User deleted' });
};