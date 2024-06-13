// const express = require('express');
// const router = express.Router();
// const entryService = require('../services/entryservice');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads/'));
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// router.post('/', upload.single('photo'), async (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }
//   try {
//     const similarityScore = await entryService.analyzeImage(req.file.path, req.body.targetId);
//     res.status(200).json({ similarityScore });
//   } catch (error) {
//     console.error('Error during image analysis:', error);
//     res.status(500).send('Error processing image analysis');
//   }
// });

// module.exports = router;
