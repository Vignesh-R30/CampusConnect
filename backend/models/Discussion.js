const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a discussion title']
    },
    content: {
        type: String,
        required: [true, 'Please provide discussion content']
    },
    category: {
        type: String,
        enum: ['Academics', 'Programming', 'Placements', 'Campus Life', 'Events', 'General'],
        default: 'General'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
