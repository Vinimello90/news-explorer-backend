const router = require('express').Router();
const { createArticle, getArticles } = require('../controllers/articles');

router.post('/', createArticle);
router.get('/', getArticles);

module.exports = router;
