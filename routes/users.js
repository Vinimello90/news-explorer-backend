const router = require('express').Router();
const { getMe } = require('../controllers/users');
const User = require('../models/user');

router.get('/me', getMe);

module.exports = router;
