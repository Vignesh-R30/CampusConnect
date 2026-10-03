const LostFound = require('../models/LostFound');

// @desc    Get all items
// @route   GET /api/lostfound
// @access  Private
const getItems = async (req, res) => {
    try {
        const items = await LostFound.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create an item
// @route   POST /api/lostfound
// @access  Private
const createItem = async (req, res) => {
    try {
        const { title, description, category, location, type, image } = req.body;

        if (!title || !description || !category || !location || !type) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const item = await LostFound.create({
            title,
            description,
            category,
            location,
            type,
            image,
            createdBy: req.user._id,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update item status
// @route   PUT /api/lostfound/:id
// @access  Private
const updateItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (req.user.role === 'admin' || item.createdBy.toString() === req.user._id.toString()) {
            item.status = status || item.status;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(403).json({ message: 'Not authorized to update this item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getItems, createItem, updateItemStatus };
