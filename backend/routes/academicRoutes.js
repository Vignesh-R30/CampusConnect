const express = require('express');
const router = express.Router();
const { getResources, uploadResource, deleteResource } = require('../controllers/academicController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getResources)
    .post(protect, uploadResource);

router.route('/:id')
    .delete(protect, deleteResource);

module.exports = router;
