const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        const { username, email, password, role } = req.body;

        // Trim email to avoid whitespace issues
        const cleanEmail = email.trim();

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            console.log('User already exists:', cleanEmail);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        const user = new User({
            username,
            email: cleanEmail,
            password: hashedPassword,
            role: role || 'client'
        });
        await user.save();
        console.log('User saved successfully:', user._id);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        const cleanEmail = email.trim();

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            console.log('User not found in DB:', cleanEmail);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for:', cleanEmail);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretKey',
            { expiresIn: '1d' }
        );

        console.log('Login successful for:', cleanEmail);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};
