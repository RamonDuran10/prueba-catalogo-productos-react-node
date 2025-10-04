const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');

router.get('/', (req, res) => {
  res.json({
    message: 'Products Management API',
    version: '1.0.0',
    status: 'running'
  });
});

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

router.use('/api', apiRoutes);

module.exports = router;
