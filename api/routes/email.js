const express = require('express');
const EmailService = require('../services/emailservice');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { email, username, subject, text } = req.body;

  try {
    await EmailService.sendEmail(email, username, subject, text);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;