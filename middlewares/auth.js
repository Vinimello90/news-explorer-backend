const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { verifyToken } = require('../utils/authTokens');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new UnauthorizedError('Authorization required'));
      return;
    }
    const token = authorization.replace('Bearer ', '');
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }
};
