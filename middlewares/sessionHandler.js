const session = require('express-session');
const { SESSION_SECRET } = process.env;

module.exports = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5,
  },
});
