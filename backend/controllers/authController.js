const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, adminKey, college, department, year, profilePicture } = req.body;



        // Verify Admin Key if registering as admin
        if (role === 'admin') {
            const SERVER_ADMIN_KEY = process.env.ADMIN_KEY || 'ADMIN123';
            if (adminKey !== SERVER_ADMIN_KEY) {
                return res.status(401).json({ message: 'Invalid Admin Key for registration' });
            }
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            department,
            year,
            profilePicture,
            role: role === 'admin' ? 'admin' : 'student', // fallback to student
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                college: user.college,
                department: user.department,
                year: user.year,
                profilePicture: user.profilePicture,
                skills: user.skills,
                interests: user.interests,
                bio: user.bio,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password, role, adminKey } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // Check if user is actually an admin trying to login as admin
            if (role === 'admin') {
                if (user.role !== 'admin') {
                    return res.status(403).json({ message: 'This account does not have administrator privileges' });
                }
                
                // Verify Admin Key
                const SERVER_ADMIN_KEY = process.env.ADMIN_KEY || 'ADMIN123';
                if (adminKey !== SERVER_ADMIN_KEY) {
                    return res.status(401).json({ message: 'Invalid Admin Key provided' });
                }
            } else if (user.role === 'admin' && role !== 'admin') {
                // If an admin tries to login as a student, we can either block it or allow it.
                // Let's force them to login as admin if they are an admin.
                return res.status(403).json({ message: 'You are an administrator. Please select Administrator account type to log in.' });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                college: user.college,
                department: user.department,
                year: user.year,
                profilePicture: user.profilePicture,
                skills: user.skills,
                interests: user.interests,
                bio: user.bio,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.college = req.body.college || user.college;
            user.department = req.body.department || user.department;
            user.year = req.body.year || user.year;
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            user.skills = req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : user.skills;
            user.interests = req.body.interests ? req.body.interests.split(',').map(i => i.trim()) : user.interests;
            user.bio = req.body.bio || user.bio;

            if (req.body.password) {
                if (req.body.password.length < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters' });
                }
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                college: updatedUser.college,
                department: updatedUser.department,
                year: updatedUser.year,
                profilePicture: updatedUser.profilePicture,
                skills: updatedUser.skills,
                interests: updatedUser.interests,
                bio: updatedUser.bio,
                token: generateToken(updatedUser._id, updatedUser.role),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during update' });
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        
        // Return only the fields requested by the user, plus email and role for safety
        const users = await User.find({ role: 'student' }).select('name year department email profilePicture createdAt');
        res.json(users);
    } catch (error) {
        console.error('Fetch Users Error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers
};
