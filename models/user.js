const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
  username: {
    type: String,
    minlength: 2,
    maxLength: 30,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
