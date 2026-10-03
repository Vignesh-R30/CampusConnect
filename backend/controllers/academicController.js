const AcademicResource = require('../models/AcademicResource');

// @desc    Get all academic resources (with optional filters)
// @route   GET /api/academics
// @access  Private
const getResources = async (req, res) => {
    try {
        const { department, semester, type } = req.query;
        let query = {};
        
        if (department && department !== 'All') query.department = department;
        if (semester && semester !== '0') query.semester = Number(semester);
        if (type && type !== 'All') query.resourceType = type;

        const resources = await AcademicResource.find(query)
            .populate('uploadedBy', 'name role')
            .sort({ createdAt: -1 });
            
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload a new resource
// @route   POST /api/academics
// @access  Private
const uploadResource = async (req, res) => {
    try {
        const { title, description, department, semester, subjectCode, resourceType, fileUrl } = req.body;

        if (!title || !description || !department || semester === undefined || !fileUrl) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const resource = await AcademicResource.create({
            title,
            description,
            department,
            semester,
            subjectCode,
            resourceType,
            fileUrl,
            uploadedBy: req.user._id
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/academics/:id
// @access  Private (Admin or Uploader)
const deleteResource = async (req, res) => {
    try {
        const resource = await AcademicResource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check if user is admin OR the one who uploaded it
        if (req.user.role !== 'admin' && resource.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        await resource.deleteOne();
        res.json({ message: 'Resource removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getResources, uploadResource, deleteResource };
