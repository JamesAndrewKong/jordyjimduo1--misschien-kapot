const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

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

router.get('/', async (req, res) => {
  try {
    const targets = await Target.find().populate('owner');
    res.send(targets);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const target = await Target.findById(req.params.id).populate('owner');
    res.send(target);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;