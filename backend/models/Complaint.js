const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a complaint title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a complaint description'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    image: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
