const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItemStatus } = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getItems)
    .post(protect, createItem);

router.route('/:id')
    .put(protect, updateItemStatus);

module.exports = router;
