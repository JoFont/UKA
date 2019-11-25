const mongoose = require('mongoose');


// TODO: Change this to confirmation email logic
// const axios = require("axios");

// const getAvatar = async id => {
//   const response = await axios.get(`https://api.adorable.io/avatars/285/${id}.png`);
//   return response.data;
// };


const schema = new mongoose.Schema({
  displayName: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String,
    default: null
  },
  auth: {
    type: Map,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  lastQuery: {
    type: String
  },
  savedRecipes: {
    type: mongoose.Types.ObjectId,
    ref: "SavedRecipe"
  },
  publicComments: {
    type: mongoose.Types.ObjectId,
    ref: "PublicComment"
  }
},
{
  timestamps: true
});


module.exports = mongoose.model('User', schema);
