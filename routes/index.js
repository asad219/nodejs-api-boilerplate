const express = require('express');
const userRoutes = require('./userRoutes');
const contactRoutes = require('./contactRoutes');
const noteRoutes = require('./noteRoutes');

const router = express.Router();

// Mount user routes
router.use('/users', userRoutes);

// Mount contact routes
router.use('/contact', contactRoutes);

// Mount note routes
router.use('/notes', noteRoutes);

module.exports = router;
