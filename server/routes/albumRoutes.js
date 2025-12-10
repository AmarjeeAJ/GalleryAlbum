const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, albumController.createAlbum);
router.get('/', authMiddleware, albumController.getAlbums);
router.get('/:id', authMiddleware, albumController.getAlbumById);
router.post('/:id/autofill', authMiddleware, albumController.autofillAlbum);
router.put('/:id', authMiddleware, albumController.updateAlbum);
router.delete('/:id', authMiddleware, albumController.deleteAlbum);

module.exports = router;
