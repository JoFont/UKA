const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    data: {
        type: Map,
        required: true
    },
    notes: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "PrivateNote"
        }]
    },
    comments: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "PublicComment"
        }]
    },
},
{
    timestamps: true
});


module.exports = mongoose.model('SavedRecipe', recipe);
