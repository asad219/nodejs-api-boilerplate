const express = require('express');
const { submitContactUs } = require('../controllers/contactController');
const { authLimiter } = require('../middleware/rateLimitHandler');

const router = express.Router();

// POST /api/v1/contact
router.post('/', authLimiter, submitContactUs);

module.exports = router;
