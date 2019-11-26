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
    data: {
        type: Map,
        required: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('SavedRecipe', schema);
