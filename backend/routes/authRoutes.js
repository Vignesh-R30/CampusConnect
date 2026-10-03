const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Keep /me for backward compatibility just in case
router.get('/me', protect, (req, res) => {
    res.status(200).json({ message: 'Success', user: req.user });
});

router.get('/users', protect, getAllUsers);

module.exports = router;
