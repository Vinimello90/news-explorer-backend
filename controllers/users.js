const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredencials(email, password);
    const token = jwt.sign({ _id: user._id }, 'dev-secret', { expiresIn: '7d' });
    res.status(200).send({ token });
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash, username });
    res.status(201).send({ email: newUser.email });
  } catch (err) {
    res.status(409).send(err);
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: 'error' });
  }
};
