const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require('@simplewebauthn/server');
const User = require('../models/user');
const Passkey = require('../models/passkey');

module.exports.generateOptions = async (req, res) => {
  const _id = req.session.userId;
  const user = User.findById(_Id);
  const userPasskeys = Passkey.find({ userID: _id });

  const options = await generateRegistrationOptions({
    rpName: 'NewsExplorer',
    rpID: 'localhost',
    origin: `http://localhost:3000/`,
    email: user.email,
    attestationType: 'none',
    excludeCredentials: (
      await userPasskeys
    ).map((passkey) => ({ id: passkey.credentialID })),
    authenticatorSelection: {
      residentKey: 'Preferred',
      userVerification: 'preferred',
    },
  });

  req.session.passkeyOptions = options;
};
