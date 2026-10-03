const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    college: {
        type: String,
    },
    department: {
        type: String,
    },
    year: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    skills: {
        type: [String],
        default: [],
    },
    interests: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: '',
    },
    readAnnouncements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }],
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
}, {
    timestamps: true // This will automatically add createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);
