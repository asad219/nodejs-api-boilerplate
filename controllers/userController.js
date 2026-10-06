const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');
const {
  parseUserCreate,
  parseUserLogin,
  parseUserUpdate,
  parseSendResetPasswordCode,
  parseVerifyResetPasswordCode,
  parseUpdatePassword,
} = require('../validators/user.zod');
const { sanitizeUserResponse } = require('../utils/userUtils');
const { revokeToken, isTokenRevoked } = require('../utils/tokenRevocation');
const { TOKEN_AUDIENCE, generateOtp, hashOtp, verifyOtp } = require('../utils/otpUtils');
const {
  sendRegistrationSuccessEmail,
  sendResetPasswordOtpEmail,
} = require('../services/emailService');
const config = require('../config');
const logger = require('../config/logger');

const verifyResetToken = (token) =>
  jwt.verify(token, config.jwt.resetPasswordSecret, {
    algorithms: ['HS256'],
    audience: TOKEN_AUDIENCE.RESET_PASSWORD,
  });

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user: sanitizeUserResponse(user),
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { password, ...userData } = parseUserCreate(req.body);

  const existingUser = await User.exists({ email: userData.email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);
  const user = await User.create({ ...userData, passwordHash });

  const otp = generateOtp();
  const verificationToken = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      otpHash: hashOtp(otp, config.jwt.verifiedSecret),
    },
    config.jwt.verifiedSecret,
    {
      expiresIn: config.jwt.verifiedExpiresIn,
      algorithm: 'HS256',
      audience: TOKEN_AUDIENCE.EMAIL_VERIFICATION,
    }
  );

  try {
    await sendRegistrationSuccessEmail({ to: user.email, firstName: user.firstName, otp });
  } catch (error) {
    logger.error('Failed to send registration success email', {
      userId: user._id.toString(),
      email: user.email,
      error: error.message,
    });
  }

  res.status(201).json({
    message: 'User registered successfully',
    user: sanitizeUserResponse(user),
    verificationToken,
    expiresIn: config.jwt.verifiedExpiresIn,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = parseUserLogin(req.body);

  const user = await User.findOne({ email });
  const isValidPassword =
    user && user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!isValidPassword) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn, algorithm: 'HS256', audience: TOKEN_AUDIENCE.ACCESS }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: sanitizeUserResponse(user),
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    await revokeToken(token);
  }

  res.status(200).json({
    message: 'Logout successful',
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { password, ...updateData } = parseUserUpdate(req.body);

  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  Object.assign(user, updateData);
  if (password) {
    user.passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);
  }
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: sanitizeUserResponse(user),
  });
});

const sendResetPasswordCode = asyncHandler(async (req, res) => {
  const { email } = parseSendResetPasswordCode(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  const code = generateOtp();
  const resetToken = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      codeHash: hashOtp(code, config.jwt.resetPasswordSecret),
    },
    config.jwt.resetPasswordSecret,
    {
      expiresIn: config.jwt.resetPasswordExpiresIn,
      algorithm: 'HS256',
      audience: TOKEN_AUDIENCE.RESET_PASSWORD,
    }
  );

  try {
    await sendResetPasswordOtpEmail({ to: user.email, firstName: user.firstName, otp: code });
  } catch (error) {
    logger.error('Failed to send reset password email', {
      userId: user._id.toString(),
      email: user.email,
      error: error.message,
    });
    res.status(500);
    throw new Error('Failed to send reset password email');
  }

  res.status(200).json({
    message: 'Reset password code sent successfully',
    token: resetToken,
    expiresIn: config.jwt.resetPasswordExpiresIn,
  });
});

const verifyResetPasswordCode = asyncHandler(async (req, res) => {
  const { token, code } = parseVerifyResetPasswordCode(req.body);

  if (await isTokenRevoked(token)) {
    res.status(200).json({ verified: false });
    return;
  }

  let decoded;
  try {
    decoded = verifyResetToken(token);
  } catch {
    res.status(200).json({ verified: false });
    return;
  }

  const verified = verifyOtp(code, decoded.codeHash, config.jwt.resetPasswordSecret);

  res.status(200).json({
    verified,
    email: verified ? decoded.email : undefined,
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { email, password, token, code } = parseUpdatePassword(req.body);

  if (await isTokenRevoked(token)) {
    res.status(401);
    throw new Error('Reset token has already been used');
  }

  let decoded;
  try {
    decoded = verifyResetToken(token);
  } catch {
    res.status(401);
    throw new Error('Invalid or expired reset token');
  }

  if (decoded.email !== email) {
    res.status(401);
    throw new Error('Invalid reset token for this email');
  }

  if (!verifyOtp(code, decoded.codeHash, config.jwt.resetPasswordSecret)) {
    res.status(401);
    throw new Error('Invalid reset code');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  user.passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);
  await user.save();

  await revokeToken(token, config.jwt.resetPasswordSecret);

  res.status(200).json({
    message: 'Password updated successfully',
  });
});

module.exports = {
  getUserById,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  sendResetPasswordCode,
  verifyResetPasswordCode,
  updatePassword,
};
