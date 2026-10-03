const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name email').sort({ date: 1 }); // Sort by upcoming dates
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, organizer, category, image, registrationDeadline, feeType, feeAmount, paymentQrCode } = req.body;

        if (!title || !description || !date || !location || !organizer) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            organizer,
            category,
            image,
            registrationDeadline,
            feeType,
            feeAmount,
            paymentQrCode,
            createdBy: req.user._id,
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (req.user.role === 'admin' || event.createdBy.toString() === req.user._id.toString()) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(403).json({ message: 'Not authorized to delete this event' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const EventRegistration = require('../models/EventRegistration');

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;
        const { name, department, section, collegeMailId, registerNumber, eventType, teamMembers, upiId, transactionId, amountPaid, dateOfPayment } = req.body;

        if (!name || !department || !section || !collegeMailId || !registerNumber || !eventType) {
            return res.status(400).json({ message: 'Please provide all required registration fields' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.feeType === 'Paid' && (!transactionId || !amountPaid)) {
             return res.status(400).json({ message: 'Payment details are required for paid events' });
        }

        const existingReg = await EventRegistration.findOne({ event: eventId, user: userId });
        if (existingReg) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        const registration = await EventRegistration.create({
            event: eventId,
            user: userId,
            name,
            department,
            section,
            collegeMailId,
            registerNumber,
            eventType,
            teamMembers,
            upiId,
            transactionId,
            amountPaid,
            dateOfPayment
        });

        res.status(201).json(registration);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Private
const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const registrations = await EventRegistration.find({ event: eventId }).populate('user', 'name email college department');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getEvents, createEvent, deleteEvent, registerForEvent, getEventRegistrations };
