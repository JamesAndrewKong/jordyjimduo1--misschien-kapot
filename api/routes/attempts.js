const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    axios.get(`${process.env.ATTEMPT_SERVICE_URL}/attempts`, {
        params: {
            page: req.query.page,
            perPage: req.query.perPage,
        },
    })
        .then(response => res.json(paginate(response.data, req)))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    axios.get(`${process.env.ATTEMPT_SERVICE_URL}/attempts/${req.params.id}`)
        .then(response => res.json(response.data))
        .catch(next);
});

router.post('/', async (req, res, next) => {
    try {
        const {data} = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.body.targetId}`);

        req.body.userId = req.user._id;
        req.body.targetImageId = data.imageId;

        axios.post(`${process.env.ATTEMPT_SERVICE_URL}/attempts`, req.body)
            .then(response => res.status(201).json(response.data))
            .catch(next);
    } catch (error) {
        next(createError('Target not found', 404));
    }
});

router.delete('/:id', (req, res, next) => {
    axios.delete(`${process.env.ATTEMPT_SERVICE_URL}/attempts/${req.params.id}`, {
        data: {
            userId: req.user._id,
            userRole: req.user.role,
        },
    })
        .then(response => {
            res.status(201);
            res.json(response.data);
        })
        .catch(next);
});

module.exports = router;
