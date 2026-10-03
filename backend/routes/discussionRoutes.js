const express = require('express');
const router = express.Router();
const { getDiscussions, createDiscussion, toggleUpvote, addComment, deleteDiscussion, reportDiscussion } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDiscussions)
    .post(protect, createDiscussion);

router.route('/:id')
    .delete(protect, deleteDiscussion);

router.route('/:id/upvote')
    .post(protect, toggleUpvote);

router.route('/:id/comment')
    .post(protect, addComment);

router.route('/:id/report')
    .post(protect, reportDiscussion);

module.exports = router;
