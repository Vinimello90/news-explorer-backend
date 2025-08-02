const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { generateToken } = require('../utils/authTokens');
const passkey = require('../models/passkey');

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredencials(email, password);
    const token = generateToken(user);
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash, username });
    req.session.userId = newUser._id;
    res.status(201).send({ email: newUser.email });
  } catch (err) {
    next(err);
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(() => {
      throw new UnauthorizedError('User not found. Please Login again.');
    });
    const passkeys = await passkey.find({ userID: _id });
    if (passkeys.length > 0) {
      res.status(200).send({ user, hasPasskey: true });
    } else {
      req.session.userId = _id;
      res.status(200).send({ user, hasPasskey: false });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
