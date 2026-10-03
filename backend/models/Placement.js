const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Please provide the company name'],
        trim: true
    },
    jobRole: {
        type: String,
        required: [true, 'Please provide the job role']
    },
    package: {
        type: String,
        required: [true, 'Please provide the salary package (e.g., 10 LPA)']
    },
    driveDate: {
        type: Date,
        required: [true, 'Please provide the drive date']
    },
    cgpaCriteria: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide the job description']
    },
    registrationLink: {
        type: String,
        required: [true, 'Please provide an application or registration link']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);
