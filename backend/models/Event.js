const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an event title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide an event description'],
    },
    date: {
        type: Date,
        required: [true, 'Please provide an event date'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    organizer: {
        type: String,
        required: [true, 'Please provide an organizer'],
    },
    category: {
        type: String,
        enum: ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Club', 'Technical'],
        default: 'Workshop'
    },
    image: {
        type: String
    },
    registrationDeadline: {
        type: Date
    },
    feeType: {
        type: String,
        enum: ['Free', 'Paid'],
        default: 'Free'
    },
    feeAmount: {
        type: Number,
        default: 0
    },
    paymentQrCode: {
        type: String // URL to QR code image
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
