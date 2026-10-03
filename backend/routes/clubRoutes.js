const express = require('express');
const router = express.Router();
const { getClubs, createClub, joinClub, leaveClub } = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getClubs)
    .post(protect, createClub);

router.route('/:id/join')
    .post(protect, joinClub);

router.route('/:id/leave')
    .post(protect, leaveClub);

module.exports = router;
