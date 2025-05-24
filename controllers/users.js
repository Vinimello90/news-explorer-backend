const User = require('../models/user');

module.exports.createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const newUser = await User.create({ email, password, username });
    console.log(newUser.email);
    res.status(201).send({ email: newUser.email });
  } catch (err) {
    res.send({ message: 'error' });
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
