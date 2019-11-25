const mongoose = require('mongoose');


const note = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
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
