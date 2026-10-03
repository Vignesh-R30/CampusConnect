const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, location, image } = req.body;

        if (!title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            location,
            image,
            createdBy: req.user._id,
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role === 'admin' || complaint.createdBy.toString() === req.user._id.toString()) {
            const oldStatus = complaint.status;
            complaint.status = status || complaint.status;
            const updatedComplaint = await complaint.save();

            // Create notification if status changed to Resolved
            if (oldStatus !== 'Resolved' && status === 'Resolved') {
                const Notification = require('../models/Notification');
                await Notification.create({
                    userId: complaint.createdBy,
                    title: 'Complaint Resolved',
                    message: `Your complaint "${complaint.title}" has been resolved by the administration.`
                });
            }

            res.json(updatedComplaint);
        } else {
            res.status(403).json({ message: 'Not authorized to update this complaint' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getComplaints, createComplaint, updateComplaintStatus };
