const config = require('../config');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getBrand = () => ({
  companyName: config.email.fromName,
  logoUrl: config.email.logoUrl,
  appUrl: config.email.appUrl,
});

const paragraph = (content, style = '') =>
  `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#334a68;${style}">${content}</p>`;

const otpBlock = (otp, label) => {
  const { companyName } = getBrand();
  return `
          ${paragraph(label, 'margin-bottom:8px;')}
          <p style="margin:0 0 8px 0;font-size:28px;line-height:1.4;font-weight:700;letter-spacing:4px;color:#0c1f3f;">${escapeHtml(otp)}</p>
          ${paragraph(`Do not share this code with anyone. ${escapeHtml(companyName)} will never ask you for it.`, 'font-size:14px;color:#6d7f99;')}`;
};

const ctaButton = () => {
  const { companyName, appUrl } = getBrand();
  return `<a href="${escapeHtml(appUrl)}" style="display:inline-block;padding:12px 20px;background:#0c1f3f;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Open ${escapeHtml(companyName)}</a>`;
};

const renderLayout = ({
  heading,
  body,
  footer = 'This is an automated email. Please do not reply directly to this message.',
}) => {
  const { companyName, logoUrl } = getBrand();
  return `
  <div style="margin:0;padding:24px;background-color:#f5f7fb;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5eaf1;">
      <tr>
        <td style="padding:24px 24px 16px 24px;text-align:center;background:#eef2f8;">
          <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)} logo" style="height:44px;max-width:220px;object-fit:contain;display:inline-block;" />
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px 8px 24px;color:#10213d;">
          <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.25;color:#10213d;">${heading}</h1>
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px 24px 24px;font-size:12px;line-height:1.6;color:#6d7f99;border-top:1px solid #e5eaf1;">
          ${footer}
        </td>
      </tr>
    </table>
  </div>`;
};

const buildRegistrationSuccessEmail = ({ firstName, otp }) => {
  const { companyName, appUrl } = getBrand();
  const safeName = escapeHtml(firstName || 'there');
  const safeCompany = escapeHtml(companyName);

  const subject = `Welcome to ${companyName}`;

  const html = renderLayout({
    heading: 'Registration Successful',
    body: `
          ${paragraph(`Hi ${safeName},`)}
          ${paragraph(`Thank you for joining <strong>${safeCompany}</strong>. Your account has been created successfully.`)}
          ${otp ? otpBlock(otp, 'Your one-time verification code is:') : ''}
          ${paragraph('If you did not create this account, please contact our support team immediately.', 'margin-bottom:24px;')}
          ${ctaButton()}`,
  });

  const otpText = otp
    ? `\nYour one-time verification code is: ${otp}\n\nDo not share this code with anyone. ${companyName} will never ask you for it.\n`
    : '';

  const text = `Hi ${firstName || 'there'},\n\nRegistration successful. Welcome to ${companyName}.\n${otpText}\nOpen app: ${appUrl}\n\nIf you did not create this account, please contact support.`;

  return { subject, html, text };
};

const buildResetPasswordOtpEmail = ({ firstName, otp }) => {
  const { companyName, appUrl } = getBrand();
  const safeName = escapeHtml(firstName || 'there');

  const subject = `Reset your password - ${companyName}`;

  const html = renderLayout({
    heading: 'Reset Your Password',
    body: `
          ${paragraph(`Hi ${safeName},`)}
          ${paragraph(`We received a request to reset the password for your <strong>${escapeHtml(companyName)}</strong> account. Use the code below to continue.`)}
          ${otpBlock(otp, 'Your one-time password reset code is:')}
          ${paragraph('If you did not request a password reset, please ignore this email or contact our support team immediately.', 'margin-bottom:24px;')}
          ${ctaButton()}`,
  });

  const text = `Hi ${firstName || 'there'},\n\nWe received a request to reset the password for your ${companyName} account.\n\nYour one-time password reset code is: ${otp}\n\nDo not share this code with anyone. ${companyName} will never ask you for it.\n\nOpen app: ${appUrl}\n\nIf you did not request a password reset, please ignore this email or contact support.`;

  return { subject, html, text };
};

const buildContactUsEmail = ({ name, email, subject: userSubject, message }) => {
  const safeName = escapeHtml(name || 'Anonymous');
  const safeMessage = escapeHtml(message || '').replace(/\n/g, '<br />');

  const subject = userSubject || 'New contact message';

  const html = renderLayout({
    heading: 'New Contact Message',
    body: `
          ${paragraph(`<strong>Name:</strong> ${safeName}`, 'margin-bottom:8px;')}
          ${paragraph(`<strong>Email:</strong> ${escapeHtml(email || '')}`, 'margin-bottom:8px;')}
          ${paragraph(`<strong>Subject:</strong> ${escapeHtml(userSubject || 'Contact form message')}`)}
          ${paragraph('<strong>Message:</strong>', 'margin-bottom:8px;')}
          ${paragraph(safeMessage, 'margin-bottom:24px;padding:16px;background:#f7f9fc;border-radius:8px;')}`,
    footer: `Reply directly to this email to respond to ${safeName}.`,
  });

  const text = `New contact message from ${name || 'Anonymous'}\n\nEmail: ${email || ''}\nSubject: ${userSubject || 'Contact form message'}\n\nMessage:\n${message || ''}`;

  return { subject, html, text };
};

module.exports = {
  buildRegistrationSuccessEmail,
  buildResetPasswordOtpEmail,
  buildContactUsEmail,
};
