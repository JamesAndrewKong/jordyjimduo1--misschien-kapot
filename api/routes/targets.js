const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');

router.post('/', async (req, res, next) => {
    try {
        console.log('Making POST request to target service');
        axios.post(`${process.env.TARGET_SERVICE_URL}/targets`, req.body)
            .then(response => {
                console.log('POST request to target service succeeded');
                res.status(201);
                res.json(response.data);
            })
            .catch(err => {
                console.log('POST request to target service failed');
                console.error('Error making POST request:', err.message);
                console.error('Request body:', req.body);
                next(createError(422, 'Could not create target'));
            });
    } catch (err) {
        console.error('Error before POST request:', err.message);
        next(err);
    }
});

module.exports = router;