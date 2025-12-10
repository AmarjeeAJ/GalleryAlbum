const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.array('photos', 100), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const fileUrls = req.files.map(file => {
            // Assuming server runs on the same host/port logic or use a base URL env var
            // For now, return relative path or full URL if we knew the host.
            // Client can prepend base URL.
            return `/uploads/${file.filename}`;
        });

        res.json({
            message: 'Files uploaded successfully',
            urls: fileUrls
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
