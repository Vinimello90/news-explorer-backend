const User = require('../models/user');

module.exports.getMe = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id).orFail(() => {
      throw new Error('Error');
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: 'error' });
  }
};
