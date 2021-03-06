const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("PrivateNote", schema)
