const Article = require('../models/article');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

module.exports.getArticles = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const articles = await Article.find({ owner: _id });
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

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
    const newArticle = await Article.create({
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

module.exports.removeArticles = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { articleId } = req.params;
    const currentArticle = await Article.findById(articleId).orFail(() => {
      throw new NotFoundError('No article found with the specified ID.');
    });

    if (currentArticle.owner.toString() !== _id) {
      throw new ForbiddenError('User not authorized to delete this article.');
    }
    await currentArticle.deleteOne();
    res.status(200).send({ message: 'Article removed successfully.' });
  } catch (err) {
    next(err);
  }
};
