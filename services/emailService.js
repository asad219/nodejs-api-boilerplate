const { Resend } = require('resend');
const config = require('../config');
const logger = require('../config/logger');
const {
  buildRegistrationSuccessEmail,
  buildResendOtpEmail,
  buildResetPasswordOtpEmail,
  buildContactUsEmail,
} = require('../utils/emailTemplates');

let resendClient;

const canSendEmail = () =>
  Boolean(config.email.enabled && config.email.resendApiKey && config.email.fromEmail);

const getResend = () => {
  if (!resendClient) {
    resendClient = new Resend(config.email.resendApiKey);
  }
  return resendClient;
};

const getFromAddress = () => `${config.email.fromName} <${config.email.fromEmail}>`;

const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const { data, error } = await getResend().emails.send({
    from: getFromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend');
  }

  return data;
};

const sendRegistrationSuccessEmail = async ({ to, firstName, otp }) => {
  if (!canSendEmail()) {
    logger.info('Registration email skipped: email config not enabled or incomplete');
    return;
  }

  const { subject, html, text } = buildRegistrationSuccessEmail({ firstName, otp });
  await sendEmail({ to, subject, html, text });
};

const sendResendOtpEmail = async ({ to, firstName, otp }) => {
  if (!canSendEmail()) {
    logger.info('Resend OTP email skipped: email config not enabled or incomplete');
    return;
  }

  const { subject, html, text } = buildResendOtpEmail({ firstName, otp });
  await sendEmail({ to, subject, html, text });
};

const sendResetPasswordOtpEmail = async ({ to, firstName, otp }) => {
  if (!canSendEmail()) {
    logger.info('Reset password OTP email skipped: email config not enabled or incomplete');
    return;
  }

  const { subject, html, text } = buildResetPasswordOtpEmail({ firstName, otp });
  await sendEmail({ to, subject, html, text });
};

const sendContactUsEmail = async ({ name, email, subject: userSubject, message }) => {
  if (!canSendEmail()) {
    logger.info('Contact us email skipped: email config not enabled or incomplete');
    return;
  }

  const { subject, html, text } = buildContactUsEmail({
    name,
    email,
    subject: userSubject,
    message,
  });

  await sendEmail({
    to: config.email.contactTo,
    subject,
    html,
    text,
    replyTo: email,
  });
};

module.exports = {
  sendRegistrationSuccessEmail,
  sendResendOtpEmail,
  sendResetPasswordOtpEmail,
  sendContactUsEmail,
};
