const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
} = require('../controllers/settings');

const router = express.Router();

router.route('/')
  .get(protect, getSettings)
  .put(protect, authorize('super_admin', 'school_admin'), updateSettings);

module.exports = router;