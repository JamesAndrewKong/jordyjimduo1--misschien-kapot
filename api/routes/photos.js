const express = require('express');
const multer = require('multer');
const path = require('path');
const imaggaService = require('../services/imagga');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const targetId = req.body.targetId;  // get the target's identifier from the request
    const targetDir = path.join(__dirname, '../uploads', targetId);
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const tags = await imaggaService.getTags(req.file.path);
    res.json({ imagePath: `/uploads/${req.body.targetId}/${req.file.filename}`, tags: tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;