const Club = require('../models/Club');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Private
const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find().populate('president', 'name email').populate('members', 'name department');
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Admin
const createClub = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const { name, description, category, establishedYear, coverImage } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Please provide name and description' });
        }

        const club = await Club.create({
            name,
            description,
            category: category || 'Other',
            establishedYear,
            coverImage,
            president: req.user._id, // Set the creator as the president initially, or allow selection
            members: [req.user._id] // President is automatically a member
        });

        res.status(201).json(club);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'Club name already exists' });
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
const joinClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (club.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this club' });
        }

        club.members.push(req.user._id);
        await club.save();

        res.json({ message: 'Successfully joined the club', club });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Leave a club
// @route   POST /api/clubs/:id/leave
// @access  Private
const leaveClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (club.president.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'President cannot leave the club' });
        }

        club.members = club.members.filter(member => member.toString() !== req.user._id.toString());
        await club.save();

        res.json({ message: 'Successfully left the club', club });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getClubs, createClub, joinClub, leaveClub };
