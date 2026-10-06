const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { RevokedToken } = require('../models/revokedTokenModel');
const config = require('../config');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const revokeToken = async (token, secret = config.jwt.secret) => {
  const decoded = jwt.verify(token, secret);
  const expiresAt = decoded.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tokenHash = hashToken(token);

  await RevokedToken.updateOne({ tokenHash }, { tokenHash, expiresAt }, { upsert: true });
};

const isTokenRevoked = async (token) => {
  const revoked = await RevokedToken.exists({ tokenHash: hashToken(token) });
  return Boolean(revoked);
};

module.exports = {
  revokeToken,
  isTokenRevoked,
};
