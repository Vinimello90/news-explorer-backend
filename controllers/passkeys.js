const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { isoUint8Array } = require('@simplewebauthn/server/helpers');
const User = require('../models/user');
const Passkey = require('../models/passkey');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { generateToken } = require('../utils/authTokens');

module.exports.generateRegistrationOptions = async (req, res) => {
  const _id = req.session.userId;
  const user = await User.findById(_id);
  const userPasskeys = await Passkey.find({ userID: _id });
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
  req.session.registrationOptions = options;
  res.status(200).send(options);
};

module.exports.verifyRegistration = async (req, res) => {
  const { body } = req;
  const _id = req.session.userId || req.user;
  const user = await User.findById(_id);
  const currentOption = req.session.registrationOptions;
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

  await Passkey.create(newPasskey);

  res.status(201).send(verified);
};

module.exports.generateAuthenticationOptions = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: email,
  });
  const userPasskeys = await Passkey.find({ userID: user._id });
  const options = await generateAuthenticationOptions({
    rpID: 'localhost',
    allowCredentials: userPasskeys.map((passkey) => ({
      id: passkey.credentialID,
      transports: passkey.transports,
    })),
  });

  req.session.authenticationOptions = options;
  req.session.userData = user;
  res.status(200).send(options);
};

module.exports.verifyAuthentication = async (req, res) => {
  const response = req.body;
  const user = req.session.userData;
  const currentOption = req.session.authenticationOptions;
  const passkey = await Passkey.findOne({ credentialID: response.id });
  let verification;

  try {
    verification = await verifyAuthenticationResponse({
      response: response,
      expectedChallenge: currentOption.challenge,
      expectedOrigin: `http://localhost:5173`,
      expectedRPID: 'localhost',
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(passkey.publicKey),
        counter: passkey.counter,
        transports: passkey.transports,
      },
      requireUserVerification: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: err.message });
  }
  const { verified, authenticationInfo } = verification;
  if (!verified) {
    return new UnauthorizedError('error');
  }
  await Passkey.findByIdAndUpdate(passkey._id, {
    counter: authenticationInfo.counter,
  });
  const token = generateToken(user);
  res.status(200).send({ token });
};
