const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const announcements = await Announcement.find(query)
            .populate('createdBy', 'name')
            .sort({ isPinned: -1, createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const { title, content, category, isPinned } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Please provide title and content' });
        }

        const announcement = await Announcement.create({
            title,
            content,
            category: category || 'General',
            isPinned: isPinned || false,
            createdBy: req.user._id
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark announcement as read
// @route   POST /api/announcements/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        
        if (!user.readAnnouncements.includes(req.params.id)) {
            user.readAnnouncements.push(req.params.id);
            await user.save();
        }

        res.json({ message: 'Announcement marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    markAsRead
};
