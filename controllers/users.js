const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredencials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );
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
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
