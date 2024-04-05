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
    axios.post(`${process.env.USER_SERVICE_URL}/users`, req.body)
        .then(response => {
            res.status(201);
            res.json(response.data);
        })
        .catch(() => next(createError(422, 'Could not create user')));
});

router.post('/login', async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/users?userName=${req.body.userName}`);
        const user = response.data[0];
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return next(createError(401, 'Invalid username or password'));
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;