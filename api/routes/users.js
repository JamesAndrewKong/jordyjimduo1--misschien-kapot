const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    axios.get(`${process.env.USER_SERVICE_URL}/users`, {
        params: {
            page: req.query.page,
            perPage: req.query.perPage,
        },
    })
        .then(response => res.json(paginate(response.data, req)))
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    axios.get(`${process.env.USER_SERVICE_URL}/users/${req.params.id}`)
        .then(response => res.json(response.data))
        .catch(next);
});

router.get('/targets/:id', async (req, res, next) => {
    try {
        const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/users/${req.params.id}`);

        axios.get(`${process.env.TARGET_SERVICE_URL}/targets`, {
            params: {
                userId: data._id,
                page: req.query.page,
                perPage: req.query.perPage,
            },
        })
            .then(response => res.json(paginate(response.data, req)))
            .catch(next);
    } catch (error) {
        next(createError('User not found', 404));
    }
});

router.get('/attempts/:id', async (req, res, next) => {
    try {
        const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/users/${req.params.id}`);

        axios.get(`${process.env.ATTEMPT_SERVICE_URL}/attempts?userId=${data._id}`, {
            params: {
                page: req.query.page,
                perPage: req.query.perPage,
            },
        })
            .then(response => res.json(paginate(response.data, req)))
            .catch(next);
    } catch (error) {
        next(createError('User not found', 404));
    }
});

router.post('/', async (req, res, next) => {
    axios.post(`${process.env.USER_SERVICE_URL}/users`, req.body)
        .then(response => {
            res.status(201);
            res.json(response.data);
        })
        .catch(() => next(createError(422, 'Could not create user')));
});

module.exports = router;
