const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

router.post('/', async (req, res, next) => {
    try {
        console.log('Making POST request to user service');
        axios.post(`${process.env.USER_SERVICE_URL}/users`, req.body)
            .then(response => {
                console.log('POST request to user service succeeded');
                res.status(201);
                res.json(response.data);
            })
            .catch(err => {
                console.log('POST request to user service failed');
                console.error('Error making POST request:', err.message);
                console.error('Request body:', req.body);
                next(createError(422, 'Could not create user'));
            });
    } catch (err) {
        console.error('Error before POST request:', err.message);
        next(err);
    }
});

module.exports = router;