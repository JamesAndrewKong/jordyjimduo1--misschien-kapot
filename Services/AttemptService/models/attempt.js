const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    imageId: {type: String},
    score: {type: Number},
    targetId: {type: String, required: true},
    userId: {type: String, required: true},
}, { versionKey: false });

attemptSchema.query.byPage = require('../helpers/paginationQuery');

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;
