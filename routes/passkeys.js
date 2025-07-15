const router = require('express').Router();
const {
  generateOptions,
  verifyRegistration,
} = require('../controllers/passkeys');

router.get('/register/options', generateOptions);
router.post('/register/verify', verifyRegistration);

module.exports = router;
