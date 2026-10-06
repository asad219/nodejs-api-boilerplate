const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const revokedTokenSchema = new Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// MongoDB removes each document once its expiresAt has passed
revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RevokedToken = model('RevokedToken', revokedTokenSchema);

module.exports = { RevokedToken };
