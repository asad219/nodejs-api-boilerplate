const crypto = require('crypto');

// JWT `aud` claim per token type; validateToken only accepts ACCESS
const TOKEN_AUDIENCE = {
  ACCESS: 'access',
  EMAIL_VERIFICATION: 'email-verification',
  RESET_PASSWORD: 'reset-password',
};

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

// JWT payloads are readable by the client, so only a keyed hash of the code is embedded
const hashOtp = (otp, secret) => crypto.createHmac('sha256', secret).update(otp).digest('hex');

const verifyOtp = (otp, otpHash, secret) => {
  if (!otp || !otpHash) return false;
  const expected = Buffer.from(hashOtp(otp, secret), 'hex');
  const actual = Buffer.from(otpHash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

module.exports = {
  TOKEN_AUDIENCE,
  generateOtp,
  hashOtp,
  verifyOtp,
};
