const mongoose = require('mongoose');

const academicResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a brief description']
    },
    department: {
        type: String,
        required: [true, 'Please specify the department (e.g., CSE, ECE, All)']
    },
    semester: {
        type: Number,
        required: [true, 'Please specify the semester (1-8, or 0 for General)']
    },
    subjectCode: {
        type: String,
        trim: true,
        default: 'General'
    },
    resourceType: {
        type: String,
        enum: ['Notes', 'Syllabus', 'Question Paper', 'E-Book', 'Other'],
        default: 'Notes'
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide a valid file URL (Google Drive, PDF link, etc.)']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AcademicResource', academicResourceSchema);
