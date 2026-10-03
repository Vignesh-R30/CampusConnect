const Placement = require('../models/Placement');

// @desc    Get all placements
// @route   GET /api/placements
// @access  Private
const getPlacements = async (req, res) => {
    try {
        const placements = await Placement.find()
            .populate('postedBy', 'name role')
            .sort({ driveDate: 1 });
            
        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a placement drive
// @route   POST /api/placements
// @access  Private (Admin only)
const createPlacement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can post placement drives' });
        }

        const { companyName, jobRole, package, driveDate, cgpaCriteria, description, registrationLink } = req.body;

        if (!companyName || !jobRole || !package || !driveDate || !description || !registrationLink) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const placement = await Placement.create({
            companyName,
            jobRole,
            package,
            driveDate,
            cgpaCriteria,
            description,
            registrationLink,
            postedBy: req.user._id
        });

        res.status(201).json(placement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a placement drive
// @route   DELETE /api/placements/:id
// @access  Private (Admin only)
const deletePlacement = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete placement drives' });
        }

        const placement = await Placement.findById(req.params.id);
        if (!placement) {
            return res.status(404).json({ message: 'Placement not found' });
        }

        await placement.deleteOne();
        res.json({ message: 'Placement drive removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getPlacements, createPlacement, deletePlacement };
