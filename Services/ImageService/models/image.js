const Mongoose = require('mongoose');

const imageSchema = new Mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
});

imageSchema.query.byPage = require('../helpers/paginationQuery');

imageSchema.path('content').validate((val) => {
    let urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = Mongoose.model('Image', imageSchema);
