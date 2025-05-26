const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
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
  url: {
    type: String,
    required: true,
    unique: true,
    validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
    message: '`link` value is not a valid URL',
  },
  urlToImage: {
    type: String,
    required: true,
    validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
    message: '`link` value is not a valid URL',
  },
  publishedAt: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Article', articleSchema);
