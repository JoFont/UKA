const mongoose = require('mongoose');


// TODO: Change this to confirmation email logic



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
    ref: "SavedRecipes"
  },
  publicComments: {
    type: mongoose.Types.ObjectId,
    ref: "PublicComments"
  }
},
{
  timestamps: true
});


module.exports = mongoose.model('User', schema);
