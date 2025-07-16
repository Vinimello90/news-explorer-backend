const router = require('express').Router();
const {
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  verifyAuthentication,
} = require('../controllers/passkeys');

router.post('/register/options', generateRegistrationOptions);
router.post('/register/verify', verifyRegistration);
router.post('/authentication/options', generateAuthenticationOptions);
router.post('/authentication/verify', verifyAuthentication);

module.exports = router;
