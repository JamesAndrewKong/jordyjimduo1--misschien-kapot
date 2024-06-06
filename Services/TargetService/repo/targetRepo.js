const Target = require('../models/target');

class TargetRepo{
    create(value) {
        return new Promise((resolve, reject) => {
            const target = new Target(value);
            target.save()
                .then(resolve).catch(reject);
        });
    }

    delete(value) {
        return new Promise((resolve, reject) => {
            Target.deleteOne({_id: value})
                .then(resolve).catch(reject);
        });
    }

    update(value) {
        return new Promise((resolve, reject) => {
            Target.updateOne({_id: value.callerId}, {imageId: value.imageId}, {runValidators: true})
                .then(res => {
                    console.log(res);
                    resolve(res);
                }).catch(reject);
        });
    }
}

module.exports = new TargetRepo();
