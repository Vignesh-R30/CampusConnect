const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a club name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a club description']
    },
    category: {
        type: String,
        enum: ['Technical', 'Cultural', 'Sports', 'Literary', 'Social', 'Other'],
        default: 'Other'
    },
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/400x200?text=Campus+Club'
    },
    president: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    establishedYear: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
