const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy and running' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/lostfound', require('./routes/lostFoundRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/discussions', require('./routes/discussionRoutes'));
app.use('/api/academics', require('./routes/academicRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Database connection
const connectDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected successfully');
        } else {
            console.log('MONGO_URI is not defined in environment variables. Skipping DB connection for now.');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
