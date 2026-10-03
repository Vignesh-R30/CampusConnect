const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: [true, 'Please specify if the item is Lost or Found'],
    },
    image: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['Active', 'Resolved'],
        default: 'Active',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('LostFound', lostFoundSchema);
