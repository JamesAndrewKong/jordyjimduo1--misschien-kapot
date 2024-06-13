const mongoose = require('mongoose');
const SlugPlugin = require('../helpers/slug');
const Bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true},
    },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user', enum: {values: ['user', 'admin']}},
}, { versionKey: false });

userSchema.plugin(SlugPlugin('userName'));

userSchema.query.byPage = require('../helpers/paginationQuery');

userSchema.pre('validate', function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
