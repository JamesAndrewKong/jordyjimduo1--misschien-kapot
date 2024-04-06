const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Target = require('../models/target');
const paginate = require('../helpers/paginatedResponse');
const validId = require('../helpers/validId');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', 
  upload.single('photo'), 
  body('deadline').isDate(),
  body('owner').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const target = new Target({
        photo: req.file.path,
        deadline: req.body.deadline,
        owner: req.body.owner
      });
      await target.save();
      res.send(target);
    } catch (err) {
      res.status(500).send(err);
    }
});

router.get('/', async (req, res, next) => {
  const result = Target.find().byPage(req.query.page, req.query.perPage);

  const count = await Target.countDocuments();

  result.then(data => res.json(paginate(data, count, req)))
      .catch(next);
});

router.get('/:id', async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).send('Invalid ID');
  }

  try {
    const target = await Target.findById(req.params.id).populate('owner');
    res.send(target);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', 
  upload.single('photo'), 
  body('deadline').isDate(),
  body('owner').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const target = await Target.findById(req.params.id);
      if (!target) {
        return res.status(404).send('Target not found');
      }

      target.photo = req.file.path;
      target.deadline = req.body.deadline;
      target.owner = req.body.owner;

      await target.save();
      res.send(target);
    } catch (err) {
      res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
    if (!target) {
      return res.status(404).send('Target not found');
    }

    await target.remove();
    res.send('Target deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;