const path = require('path');
const winston = require('winston');
const config = require('./index');

const logsDir = path.join(__dirname, '..', 'logs');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: {
    service: 'myapp-api',
  },
  transports: [
    // Errors only
    new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
    // Everything at the configured level and above
    new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }),
  ],
});

if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

module.exports = logger;
