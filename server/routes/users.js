const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const router = express.Router();

router.route('/')
  .get(protect, authorize('super_admin', 'school_admin'), getUsers)
  .post(protect, authorize('super_admin', 'school_admin'), createUser);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteUser);

module.exports = router;