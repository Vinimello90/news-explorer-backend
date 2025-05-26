const router = require('express').Router();
const {
  validateCreateArticle,
} = require('../utils/validators/articlesValidators');
const {
  createArticle,
  getArticles,
  removeArticles,
} = require('../controllers/articles');

router.post('/', validateCreateArticle, createArticle);
router.get('/', getArticles);
router.delete('/:articleId', removeArticles);

module.exports = router;
