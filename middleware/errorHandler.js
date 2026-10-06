const { constants } = require('../utils/constants');
const logger = require('../config/logger');

const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return 'Validation Failed';
    case constants.UNAUTHORIZED:
      return 'Unauthorized';
    case constants.FORBIDDEN:
      return 'Forbidden';
    case constants.NOT_FOUND:
      return 'Not found';
    case constants.SERVER_ERROR:
    default:
      return 'Server Error';
  }
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error('Headers already sent. Cannot send response again.', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
    return next(err);
  }

  // Controllers set res.status() before throwing; third-party errors (e.g. body-parser) carry err.status
  let statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : err.status || err.statusCode || constants.SERVER_ERROR;
  let message = err.message;

  if (err.name === 'ZodError') {
    statusCode = constants.VALIDATION_ERROR;
    message = err.issues.map((issue) => issue.message).join(', ');
  }

  logger.error('API Error', {
    statusCode,
    message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(statusCode).json({
    title: getErrorTitle(statusCode),
    message,
  });
};

module.exports = errorHandler;
