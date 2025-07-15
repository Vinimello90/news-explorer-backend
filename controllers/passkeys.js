const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require('@simplewebauthn/server');
const { isoUint8Array } = require('@simplewebauthn/server/helpers');
const User = require('../models/user');
const Passkey = require('../models/passkey');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

module.exports.generateOptions = async (req, res) => {
  const _id = '683a55952e8a5e8078bc1b92';
  const user = await User.findById(_id);
  const userPasskeys = await Passkey.find({ userID: _id });
  console.log(userPasskeys);
  const options = await generateRegistrationOptions({
    rpName: 'NewsExplorer',
    rpID: 'localhost',
    origin: `http://localhost:3001`,
    userName: user.email,
    userDisplayName: user.email,
    userID: isoUint8Array.fromUTF8String(_id),
    attestationType: 'none',
    excludeCredentials: userPasskeys.map((passkey) => ({
      id: passkey.credentialID,
      transports: passkey.transports,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });
  req.session.passkeyOptions = options;
  res.send(options).status(200);
};

module.exports.verifyRegistration = async (req, res) => {
  const { body } = req;
  const _id = '683a55952e8a5e8078bc1b92';
  const user = await User.findById(_id);
  const currentOption = req.session.passkeyOptions;
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: currentOption.challenge,
      expectedOrigin: `http://localhost:5173`,
      expectedRPID: 'localhost',
      requireUserVerification: false,
    });
  } catch (err) {
    console.log(err);
    return;
  }

  const { verified } = verification;

  if (!verified) {
    return new UnauthorizedError('error');
  }

  const { credential, credentialDeviceType, credentialBackedUp } =
    verification.registrationInfo;

  const newPasskey = {
    credentialID: credential.id,
    publicKey: Buffer.from(credential.publicKey),
    userID: user._id,
    webauthnUserID: currentOption.user.id,
    counter: credential.counter,
    deviceType: credentialDeviceType,
    backedUp: credentialBackedUp,
    transports: credential.transports,
  };
  const passkey = await Passkey.create(newPasskey);
};
