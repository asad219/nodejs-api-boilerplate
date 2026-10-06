const asyncHandler = require('express-async-handler');
const { parseContactUs } = require('../validators/contact.zod');
const { sendContactUsEmail } = require('../services/emailService');
const logger = require('../config/logger');

const submitContactUs = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = parseContactUs(req.body);

  try {
    await sendContactUsEmail({ name, email, subject, message });
  } catch (error) {
    logger.error('Failed to send contact us email', {
      email,
      error: error.message,
    });
    res.status(500);
    throw new Error('Failed to send contact us email');
  }

  res.status(200).json({
    success: true,
    message: 'Contact message sent successfully',
  });
});

module.exports = {
  submitContactUs,
};
