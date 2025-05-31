const router = require('express').Router();
const {
  validateCreateArticle,
} = require('../middlewares/validators/articlesValidators');
const {
  createArticle,
  getArticles,
  removeArticle,
  getArticleById,
} = require('../controllers/articles');

router.post('/', validateCreateArticle, createArticle);
router.get('/', getArticles);
router.get('/:articleId', getArticleById);
router.delete('/:articleId', removeArticle);

module.exports = router;
