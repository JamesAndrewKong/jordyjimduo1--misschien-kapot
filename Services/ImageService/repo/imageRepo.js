const Image = require('../models/image');
const PayLoadCreator = require('./payloadCreator');
const pub = require('../publisher');
const axios = require('axios');

class ImageRepo {
    create(value) {
        return new Promise((resolve, reject) => {
            const image = new Image({content: value.value.content});
            image.save()
                .then(savedValue => {
                    if (savedValue) {
                        const payLoadCreator = new PayLoadCreator('update', savedValue._id.toString(), value.value.id, '');
                        const payload = payLoadCreator.getPayload();
                        pub(payload, value.fromService);

                        resolve(savedValue);
                    }
                }).catch(err => {
                reject(err);
            });
        });
    }

    createAttempt(value) {
        return new Promise((resolve, reject) => {
            const image = new Image({content: value.value.content});
            image.save()
                .then(savedValue => {
                    if (savedValue) {
                        this.#compareImages(value.value.targetImageId, savedValue._id).then(res => {
                            if (res) {
                                const payLoadCreator = new PayLoadCreator('update', savedValue._id.toString(), value.value.id, res);
                                const payload = payLoadCreator.getPayload();
                                pub(payload, value.fromService);
                                res(savedValue);
                            }
                        }).catch(err => {
                            reject(err);
                        });
                        resolve(savedValue);
                    }
                }).catch(async err => {
                reject(err);
            });
        });
    }

    delete(value) {
        return new Promise((resolve, reject) => {
            Image.deleteOne({_id: value.value.content})
                .then(() => {
                    resolve();
                }).catch((err) => {
                reject(err);
            });
        });
    }

    async #compareImages(target, attempt) {
        const targetImage = await Image.findOne({_id: target});
        const attemptImage = await Image.findOne({_id: attempt});

        return new Promise((resolve, reject) => {
            const url = 'https://api.imagga.com/v2/images-similarity/categories/general_v3';

            const params = new URLSearchParams([['image_url', targetImage.content], ['image2_url', attemptImage.content]]);

            axios.get(url, {
                headers: {
                    Authorization: 'Basic ' + btoa(process.env.IMAGE_EXT_API_KEY + ':' + process.env.IMAGE_EXT_API_SECRET),
                },
                params: params,
            }).then(response => {
                const score = response.data.result.distance;
                resolve(score * 100);
            }).catch(reason => {
                console.log(reason);
                reject(reason);
            });
        });
    }
}

module.exports = new ImageRepo();
