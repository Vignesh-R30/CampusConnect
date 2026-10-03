const express = require('express');
const router = express.Router();
const { getPlacements, createPlacement, deletePlacement } = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPlacements)
    .post(protect, createPlacement);

router.route('/:id')
    .delete(protect, deletePlacement);

module.exports = router;
