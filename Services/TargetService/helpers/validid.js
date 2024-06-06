const {ObjectId} = require('mongodb');

module.exports = (id) => {
    if (id == null) return false;

    try {
        new ObjectId(id);
        return true;
    } catch {
        return false;
    }
};
