const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Basic health check
app.get('/', (req, res) => {
    res.send('PicEra API is running');
});


// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Amar1234:AmardeviL987@mern-db.aha9x.mongodb.net/picera?retryWrites=true&w=majority';
console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
