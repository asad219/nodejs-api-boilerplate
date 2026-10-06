const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { isTokenRevoked } = require('../utils/tokenRevocation');
const { TOKEN_AUDIENCE } = require('../utils/otpUtils');

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Authorization token must be Bearer token');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Token not found');
  }

  let decoded;
  try {
    // Audience check stops reset/verification tokens from being used as access tokens
    decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
      audience: TOKEN_AUDIENCE.ACCESS,
    });
  } catch {
    res.status(401);
    throw new Error('User is not authorized');
  }

  if (await isTokenRevoked(token)) {
    res.status(401);
    throw new Error('User is not authorized');
  }

  req.token = token;
  req.user = decoded;
  next();
});

module.exports = validateToken;
