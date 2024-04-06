const mongoose = require('mongoose');
const addPagination = require('../helpers/paginationQuery');

const TargetSchema = new mongoose.Schema({
  photo: String,
  location: String,
  deadline: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

TargetSchema.query.byPage = addPagination;

const Target = mongoose.model('Target', TargetSchema);

module.exports = Target;