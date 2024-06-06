const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:id', async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.IMAGE_SERVICE_URL}/images/${req.params.id}`);

        res.json(response.data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
