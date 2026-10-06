const express = require('express');
const {
  getUserById,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  sendResetPasswordCode,
  verifyResetPasswordCode,
  updatePassword,
} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const requireOwnership = require('../middleware/requireOwnership');
const { authLimiter } = require('../middleware/rateLimitHandler');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// POST /api/v1/users/register
router.post('/register', authLimiter, registerUser);

// POST /api/v1/users/login
router.post('/login', authLimiter, loginUser);

// POST /api/v1/users/logout
router.post('/logout', validateToken, logoutUser);

// POST /api/v1/users/send-reset-password-code
router.post('/send-reset-password-code', authLimiter, sendResetPasswordCode);

// POST /api/v1/users/verify-reset-password-code
router.post('/verify-reset-password-code', authLimiter, verifyResetPasswordCode);

// POST /api/v1/users/update-password
router.post('/update-password', authLimiter, updatePassword);

// GET /api/v1/users/:userId
router.get('/:userId', validateObjectId, validateToken, requireOwnership(), getUserById);

// PUT /api/v1/users/update/:userId
router.put('/update/:userId', validateObjectId, validateToken, requireOwnership(), updateUser);

module.exports = router;
