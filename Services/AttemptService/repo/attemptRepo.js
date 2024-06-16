const Attempt = require('../models/attempt');
const PayLoadCreator = require('./payloadCreator');
const pub = require('../publisher');

class TargetRepo{
    create(value) { return new Promise((resolve, reject) => {
        const target = new Attempt(value);
        target.save()
            .then(savedValue =>{
                if(savedValue){
                    resolve(savedValue);
                    return;
                }
            }).catch(async err => {
            reject(err);
        });
    });
    }

    async deleteOne(value) {
        return new Promise((resolve, reject) => {
            Attempt.deleteOne({_id: value})
                .then(resolve).catch(reject);
        });
    }

    async deleteMany(value) {
        console.log(value);
        const attempts = Attempt.find({targetId: value.id});

        for (const attempt in attempts) {
            const payloadCreator = new PayLoadCreator('delete', '', '', attempt.imageId);
            let message = payloadCreator.getPayload();
            pub(message, 'image');
        }

        return new Promise((resolve, reject) => {
            Attempt.deleteMany({targetId: value.id})
                .then(()=>{
                    resolve();
                }).catch((err)=>{
                reject(err);
            });
        });
    }

    update(value) {return new Promise((resolve, reject) => {
        Attempt.updateOne({_id: value.callerId}, {imageId: value.imageId, score: value.score}, {runValidators: true})
            .then(()=>{
                resolve();
            }).catch((err)=>{
            reject(err);
        });
    });
    }
}

module.exports = new TargetRepo();
