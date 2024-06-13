const express = require('express');
const router = express.Router();
const prometheus = require('prom-client');

// Route for serving Prometheus metrics
router.get('/', async (req, res) => {
  const registry = prometheus.register;
  res.set('Content-Type', registry.contentType);
  try {
    const metrics = await registry.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err);
  }
});

module.exports = router;
