const router = require('express').Router();
const {
  registerOptions,
  registerVerify,
  authOptions,
  authVerify,
} = require('../controllers/passkeys');

router.post('/register/options', registerOptions);
router.post('/register/verify', registerVerify);
router.post('/authentication/options', authOptions);
router.post('/authentication/verify', authVerify);

module.exports = router;
