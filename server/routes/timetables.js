const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require('../controllers/timetables');

const router = express.Router();

router.route('/')
  .get(protect, getTimetables)
  .post(protect, authorize('super_admin', 'school_admin'), createTimetable);

router.route('/:id')
  .get(protect, getTimetable)
  .put(protect, updateTimetable)
  .delete(protect, authorize('super_admin', 'school_admin'), deleteTimetable);

module.exports = router;