const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const { version } = require('../package.json');

const router = express.Router();

// GET /health
router.get('/', (req, res) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const { readyState, name } = mongoose.connection;
  const isHealthy = readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version,
    database: {
      status: isHealthy ? 'connected' : 'disconnected',
      readyState,
      name: name || 'N/A',
    },
    uptime: process.uptime(),
  });
});

module.exports = router;
