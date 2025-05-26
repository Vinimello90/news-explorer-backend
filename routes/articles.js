const router = require('express').Router();
const { createArticle } = require('../controllers/articles');

router.post('/', createArticle);

module.exports = router;
