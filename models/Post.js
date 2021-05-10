const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    autorName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    text: {
        type: String,
        required: true,
        max: 300,
        min: 2
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema);