const router = require('express').Router();
const { getMe } = require('../controllers/users');

router.get('/me', getMe);

module.exports = router;
