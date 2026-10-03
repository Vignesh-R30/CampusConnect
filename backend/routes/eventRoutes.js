const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, registerForEvent, getEventRegistrations } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .delete(protect, deleteEvent);

router.route('/:id/register')
    .post(protect, registerForEvent);

router.route('/:id/registrations')
    .get(protect, getEventRegistrations);

module.exports = router;
