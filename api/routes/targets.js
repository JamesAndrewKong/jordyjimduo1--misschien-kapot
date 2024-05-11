const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');

router.post('/', async (req, res, next) => {
    try {
        console.log('Making GET request to user service');
        const username = req.body.owner;
        const jwtToken = req.headers.authorization.split(' ')[1];  // Extract token from 'Bearer <token>'

        axios.get(`${process.env.USER_SERVICE_URL}/users?username=${username}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                console.log('GET request to user service succeeded');
                req.body.owner = response.data._id;  // Replace username with user ID

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
            })
            .catch(err => {
                console.log('GET request to user service failed');
                console.error('Error making GET request:', err.message);
                next(createError(422, 'Could not find user'));
            });
    } catch (err) {
        console.error('Error before GET request:', err.message);
        next(err);
    }
});

module.exports = router;