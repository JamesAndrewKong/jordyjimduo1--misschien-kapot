const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const adminRole = require('../helpers/adminRole');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    axios.get(`${process.env.TARGET_SERVICE_URL}/targets`, {
        params: {
            page: req.query.page,
            perPage: req.query.perPage,
        },
    })
        .then(response => res.json(paginate(response.data, req)))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`)
        .then(response => res.json(response.data))
        .catch(next);
});

router.get('/:id/attempts', async (req, res, next) => {
    try {
        const {data} = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`);

        axios.get(`${process.env.ATTEMPT_SERVICE_URL}/attempts`, {
            params: {
                targetId: data._id,
                page: req.query.page,
                perPage: req.query.perPage,
            },
        })
            .then(response => res.json(paginate(response.data, req)))
            .catch(next);
    } catch (error) {
        next(createError('Target not found', 404));
    }
});

router.post('/', adminRole, (req, res, next) => {
    req.body.userId = req.user._id;

    axios.post(`${process.env.TARGET_SERVICE_URL}/targets`, req.body)
        .then(response => res.status(201).json(response.data))
        .catch(next);
});

router.post('/:id/attempts', adminRole, async (req, res, next) => {
    try {
        const {data} = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`);

        const requestData = {
            ...req.body,
            userId: req.user._id,
            targetId: data._id,
            targetImageId: data.imageId,
        };

        axios.post(`${process.env.ATTEMPT_SERVICE_URL}/attempts`, requestData)
            .then(response => res.status(201).json(response.data))
            .catch(next);
    } catch (error) {
        next(createError('Target not found', 404));
    }
});

router.delete('/:id', adminRole, async (req, res, next) => {
    axios.delete(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`,{
            data: {
                userId: req.user._id,
            },
        })
        .then(() => res.status(204).json([]))
        .catch(next);
});

module.exports = router;
