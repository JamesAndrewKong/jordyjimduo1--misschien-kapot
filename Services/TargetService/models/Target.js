const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  photo: String,
  location: String,
  deadline: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Target', TargetSchema);