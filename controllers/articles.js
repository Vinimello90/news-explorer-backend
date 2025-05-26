const Card = require('../models/article');
Card.create();

module.exports.createArticle = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { title, description, keyword, source, url, urlToImage, publishedAt } = req.body;
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
