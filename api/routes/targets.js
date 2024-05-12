const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('../helpers/paginatedResponse');
const createError = require('http-errors');
const FormData = require('form-data');
const fs = require('fs');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('photo'), async (req, res, next) => {
    try {
        console.log('Making GET request to user service');
        const username = req.body.owner;
        console.log(`Owner username: ${username}`); 
        const jwtToken = req.headers.authorization.split(' ')[1]; 

        axios.get(`${process.env.USER_SERVICE_URL}/username/${username}`, {
              headers: {
                  'Authorization': `Bearer ${jwtToken}`
              }
          })
            .then(response => {
                console.log('GET request to user service succeeded');
                req.body.owner = response.data._id;  

                let data = req.body;
                let config = {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                };

                if (req.file && req.file.buffer) {
                    const form = new FormData();
                    form.append('photo', req.file.buffer, {
                        filename: req.file.originalname,
                        contentType: req.file.mimetype,
                    });

                    // Append other fields to form data
                    for (const key in req.body) {
                        form.append(key, req.body[key]);
                    }

                    data = form;
                    config.headers = { ...config.headers, ...form.getHeaders() };
                }

                console.log('Making POST request to target service');
                axios.post(`${process.env.TARGET_SERVICE_URL}/targets`, data, config)
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