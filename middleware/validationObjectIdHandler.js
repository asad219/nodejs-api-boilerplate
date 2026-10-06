const mongoose = require('mongoose');

// Validates every route param, so only use it on routes whose params are all ObjectIds
const validateObjectId = (req, res, next) => {
  const hasInvalidId = Object.values(req.params).some(
    (value) => !mongoose.Types.ObjectId.isValid(value)
  );

  if (hasInvalidId) {
    res.status(400);
    throw new Error('Invalid ID format');
  }

  next();
};

module.exports = {
  validateObjectId,
};
