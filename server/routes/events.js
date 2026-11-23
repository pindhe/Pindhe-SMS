const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('super_admin', 'school_admin'), createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteEvent);

module.exports = router;