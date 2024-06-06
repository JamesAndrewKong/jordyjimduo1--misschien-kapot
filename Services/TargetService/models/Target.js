const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
    description: {type: String},
    imageId: {type: String, required: false},
    location: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true},
    },
    userId: {type: String, required: true},
}, { versionKey: false });

targetSchema.query.byPage = require('../helpers/paginationQuery');

const Target = mongoose.model('Target', targetSchema);

module.exports = Target;
