const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const paginate = require('../helpers/paginatedResponse');
const passport = require('passport');

const router = express.Router();

async function verifyOwner(req, res, next) {
  try {
    const response = await axios.get(`http://targetservice/targets/${req.params.id}`);
    if (req.user.id !== response.data.owner.toString()) {
      return res.status(403).send('You are not the owner of this target');
    }
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

router.post('/', 
  passport.authenticate('jwt', { session: false }),
  body('deadline').isDate(),
  body('owner').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await axios.post('http://targetservice/targets', req.body);
      res.send(response.data);
    } catch (err) {
      res.status(500).send(err);
    }
});

router.get('/', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  try {
    const response = await axios.get('http://targetservice/targets', {
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
    const response = await axios.get(`http://targetservice/targets/${req.params.id}`);
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
      const response = await axios.put(`http://targetservice/targets/${req.params.id}`, req.body);
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
    const response = await axios.delete(`http://targetservice/targets/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;