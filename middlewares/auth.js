const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new UnauthorizedError('Authorization required'));
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }
};
