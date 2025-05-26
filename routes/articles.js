const router = require('express').Router();
const {
  createArticle,
  getArticles,
  removeArticles,
} = require('../controllers/articles');

router.post('/', createArticle);
router.get('/', getArticles);
router.delete('/:articleId', removeArticles);

module.exports = router;
