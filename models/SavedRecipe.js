const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    recipeID: {
        type: String,
        required: true,
        unique: true
    },
    authors: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }],
    count: {
        type: Number,
        min: 0
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('SavedRecipe', schema);
