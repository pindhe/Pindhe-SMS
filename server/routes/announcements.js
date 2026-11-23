const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcements');

const router = express.Router();

router.route('/')
  .get(protect, getAnnouncements)
  .post(protect, authorize('super_admin', 'school_admin'), createAnnouncement);

router.route('/:id')
  .get(protect, getAnnouncement)
  .put(protect, updateAnnouncement)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteAnnouncement);

module.exports = router;