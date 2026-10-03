const express = require('express');
const router = express.Router();
const { 
    getAnnouncements, 
    createAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement,
    markAsRead
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, createAnnouncement);

router.route('/:id')
    .put(protect, updateAnnouncement)
    .delete(protect, deleteAnnouncement);

router.post('/:id/read', protect, markAsRead);

module.exports = router;
