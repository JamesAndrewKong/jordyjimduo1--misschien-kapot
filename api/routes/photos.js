const express = require('express');
const multer = require('multer');
const imaggaService = require('../services/imagga');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // images will be saved in the 'uploads' directory

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const tags = await imaggaService.getTags(req.file.path);
    res.json({ imagePath: `/uploads/${req.file.filename}`, tags: tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;