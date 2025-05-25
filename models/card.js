const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  type: String,
  required: true,
  url: {
    type: String,
    required: true,
    validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
    message: '`link` value is not a valid URL',
  },
  urlToImage: {
    type: String,
    required: true,
    validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
    message: '`link` value is not a valid URL',
  },
  publishedAt: { type: Date },
  owner: { type: mongoose.Schema.types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Card', cardSchema);
