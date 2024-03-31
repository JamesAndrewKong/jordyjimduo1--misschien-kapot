const express = require('express');
const router = express.Router();
const prometheus = require('prom-client');

// Route for serving Prometheus metrics
router.get('/', (req, res) => {
  const registry = prometheus.register;
  res.set('Content-Type', registry.contentType);
  res.end(registry.metrics());
});

module.exports = router;