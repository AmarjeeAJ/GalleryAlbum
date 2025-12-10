const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['draft', 'client_review', 'changes_requested', 'approved', 'archived'],
        default: 'draft'
    },
    type: { type: String, enum: ['manual', 'automated'], required: true },
    parameters: {
        size: { type: String }, // e.g. "10x10"
        paperType: { type: String },
        coverValues: { type: Object }
    },
    pages: [
        {
            pageNumber: Number,
            type: { type: String }, // e.g. cover_front, inner, cover_back
            layoutId: String,
            images: [{
                imageId: String,
                url: String,
                position: Object,
                styles: Object
            }],
            comments: [{
                clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                text: String,
                timestamp: Date,
                resolved: { type: Boolean, default: false }
            }]
        }
    ],
    images: [String], // Source images for the album
}, { timestamps: true });

module.exports = mongoose.model('Album', AlbumSchema);
