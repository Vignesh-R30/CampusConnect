const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    collegeMailId: { type: String, required: true },
    registerNumber: { type: String, required: true },
    eventType: { type: String, enum: ['Solo', 'Group'], required: true },
    teamMembers: { type: String }, // For Group events
    upiId: { type: String },
    transactionId: { type: String },
    amountPaid: { type: Number },
    dateOfPayment: { type: Date },
    status: {
        type: String,
        enum: ['Registered', 'Attended', 'Cancelled'],
        default: 'Registered'
    }
}, { timestamps: true });

// Ensure a user can only register once per event
eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
