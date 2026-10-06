const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: String,
    firstName: String,
    lastName: String,
    phone: String,
    profilePicUrl: String,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });

const User = model('User', userSchema);

module.exports = { User };
