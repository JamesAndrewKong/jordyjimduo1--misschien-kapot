const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const paginate = require('../helpers/paginatedResponse');
const passport = require('passport');
const multer = require('multer');
const upload = multer();

const router = express.Router();

async function verifyOwner(req, res, next) {
  try {
    const targetResponse = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`);
    const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/users/${targetResponse.data.owner}`);
    if (req.user.id !== userResponse.data._id.toString()) {
      return res.status(403).send('You are not the owner of this target');
    }
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

router.post('/', 
  upload.single('photo'), // This will parse the 'photo' file and the text fields
  passport.authenticate('jwt', { session: false }),
  body('deadline').custom((value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTarget = {
        photo: req.file.path,
        deadline: req.body.deadline,
        location: req.body.location,
        owner: req.user.username
      };
      const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/targets`, newTarget);
      
      if (!response.data) {
        throw new Error('Failed to save target');
      }

      res.json(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

router.get('/', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets`, {
      params: {
        page: req.query.page,
        perPage: req.query.perPage,
      },
    });
    res.json(paginate(response.data, req));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
  try {
    const response = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', 
  passport.authenticate('jwt', { session: false }),
  verifyOwner,
  body('deadline').isDate(),
  body('owner').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await axios.put(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`, req.body);
      res.send(response.data);
    } catch (err) {
      res.status(500).send(err);
    }
});

router.delete('/:id', 
  passport.authenticate('jwt', { session: false }),
  verifyOwner,
  async (req, res) => {
  try {
    const response = await axios.delete(`${process.env.TARGET_SERVICE_URL}/targets/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;