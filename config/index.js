// Load environment variables first
require('dotenv').config({ quiet: true });

// Validate required environment variables
const requiredEnvVars = ['CONNECTION_STRING', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} environment variable is required`);
    process.exit(1);
  }
});

const splitList = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5005', 10),
  db: {
    uri: process.env.CONNECTION_STRING,
    dnsServers: splitList(process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8'),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    verifiedSecret: process.env.JWT_VERIFIED_SECRET || process.env.JWT_SECRET,
    verifiedExpiresIn: process.env.JWT_VERIFIED_EXPIRES_IN || '15m',
    resetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET,
    resetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN || '3m',
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? splitList(process.env.ALLOWED_ORIGINS)
      : ['http://localhost:3000'],
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  },
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    resendApiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'info@myapp.com',
    fromName: process.env.EMAIL_FROM_NAME || 'MyApp',
    contactTo: process.env.EMAIL_CONTACT_TO || process.env.EMAIL_FROM || 'info@myapp.com',
    logoUrl: process.env.COMPANY_LOGO_URL || 'https://example.com/company-logo.png',
    appUrl: process.env.APP_URL || 'https://example.com',
  },
};
