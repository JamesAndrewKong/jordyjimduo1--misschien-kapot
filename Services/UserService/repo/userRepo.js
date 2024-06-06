const User = require('../models/user');

class TargetRepo{
    create(value) {
        return new Promise((resolve, reject) => {
            const user = new User(value);
            user.save()
                .then(resolve).catch(reject);
        });
    }
}

module.exports = new TargetRepo();
