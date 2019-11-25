const mongoose = require('mongoose');

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
  }
},
{
  timestamps: true
});


module.exports = mongoose.model('User', schema);
