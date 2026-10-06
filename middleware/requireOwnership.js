const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User is not authorized');
    }

    // Admin bypass
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceUserId = req.params[paramName];
    const authenticatedUserId = String(req.user.userId);

    if (resourceUserId !== authenticatedUserId) {
      res.status(403);
      throw new Error('Access denied: You do not have permission to access this resource');
    }

    next();
  };
};

module.exports = requireOwnership;
