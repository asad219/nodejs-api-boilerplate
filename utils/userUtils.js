const sanitizeUserResponse = (user) => {
  const userObj = user.toJSON ? user.toJSON() : { ...user };
  delete userObj.passwordHash;
  return userObj;
};

module.exports = {
  sanitizeUserResponse,
};
