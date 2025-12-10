const Album = require('../models/Album');
const layoutService = require('../services/layoutService');

exports.createAlbum = async (req, res) => {
    try {
        const { title, type, parameters } = req.body;
        const clientId = req.user ? req.user.id : req.body.clientId;

        const album = new Album({
            title,
            type,
            parameters,
            clientId
        });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAlbums = async (req, res) => {
    try {
        const { role, id } = req.user;
        let query = {};
        if (role === 'client') {
            query = { clientId: id };
        }
        const albums = await Album.find(query).populate('clientId', 'username email');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const album = await Album.findByIdAndUpdate(id, updates, { new: true });
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await Album.findByIdAndDelete(id);
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json({ message: 'Album deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.autofillAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { images } = req.body;

        const album = await Album.findById(id);
        if (!album) return res.status(404).json({ message: 'Album not found' });

        let pageCount = 20;
        if (images.length <= 50) pageCount = 16;
        else if (images.length <= 62) pageCount = 20;
        else if (images.length <= 92) pageCount = 30;
        else pageCount = 40;

        const pages = layoutService.calculateLayout(images, pageCount);

        album.pages = pages;
        album.images = images;
        await album.save();

        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
