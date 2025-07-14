const session = require('express-session');

module.exports = session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5,
  },
});
