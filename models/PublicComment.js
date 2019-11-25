const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Types.ObjectId,
    ref: "SavedRecipe",
    required: true
  },
  parentComment: {
    type: mongoose.Types.ObjectId,
    ref: "PublicComment"
  },
  body: {
    type: String,
    required: true,
    maxlength: 140,
    minlength: 1
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("PublicComment", schema)