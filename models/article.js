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
    validate: {
      validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
      message: '`link` value is not a valid URL',
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^(https?:\/\/|w{3}\.)([\w-]+\.)+([\w]{2,})(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(url),
      message: '`link` value is not a valid URL',
    },
  },
  publishedAt: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

articleSchema.index({ url: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Article', articleSchema);
