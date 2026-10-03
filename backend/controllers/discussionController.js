const Discussion = require('../models/Discussion');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Private
const getDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find()
            .populate('author', 'name profilePicture')
            .populate('comments.user', 'name profilePicture')
            .sort({ createdAt: -1 });
        res.json(discussions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a discussion thread
// @route   POST /api/discussions
// @access  Private
const createDiscussion = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Please provide title and content' });
        }

        const discussion = await Discussion.create({
            title,
            content,
            category: category || 'General',
            author: req.user._id
        });

        const populatedDiscussion = await discussion.populate('author', 'name profilePicture');
        res.status(201).json(populatedDiscussion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle Upvote on a discussion
// @route   POST /api/discussions/:id/upvote
// @access  Private
const toggleUpvote = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        const hasUpvoted = discussion.upvotes.includes(req.user._id);

        if (hasUpvoted) {
            discussion.upvotes = discussion.upvotes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            discussion.upvotes.push(req.user._id);
        }

        await discussion.save();
        res.json(discussion.upvotes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a comment
// @route   POST /api/discussions/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        const comment = {
            user: req.user._id,
            text
        };

        discussion.comments.push(comment);
        await discussion.save();

        const populatedDiscussion = await discussion.populate('comments.user', 'name profilePicture');
        res.json(populatedDiscussion.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private
const deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        if (discussion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this discussion' });
        }

        await discussion.deleteOne();
        res.json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Report a discussion
// @route   POST /api/discussions/:id/report
// @access  Private
const reportDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        if (!discussion.reports) discussion.reports = [];
        
        if (!discussion.reports.includes(req.user._id)) {
            discussion.reports.push(req.user._id);
            await discussion.save();
        }

        res.json({ message: 'Discussion reported' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDiscussions, createDiscussion, toggleUpvote, addComment, deleteDiscussion, reportDiscussion };
