const Card = require('../models/article');

module.exports.createArticle = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {
      title,
      description,
      keyword,
      source,
      url,
      urlToImage,
      publishedAt,
    } = req.body;
    const newArticle = await Card.create({
      title,
      description,
      keyword,
      source,
      url,
      urlToImage,
      publishedAt,
      owner: _id,
    });
    res.status(201).send(newArticle);
  } catch (err) {
    next(err);
  }
};

module.exports.getArticles = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const articles = await Card.find({ owner: _id });
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};
