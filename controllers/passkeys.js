const User = require('../models/user');
const Passkey = require('../models/passkey');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { generateToken } = require('../utils/authTokens');
const {
  verifyRegistration,
  getRegistrationOptions,
  getAuthenticationOptions,
  verifyAuthentication,
} = require('../utils/webAuthnService');

module.exports.registerOptions = async (req, res, next) => {
  try {
    const _id = req.session.userId;
    const user = await User.findById(_id);
    const userPasskeys = await Passkey.find({ userID: _id });
    const options = await getRegistrationOptions(user, userPasskeys);
    req.session.registrationOptions = options;
    res.status(200).send(options);
  } catch (err) {
    next(err);
  }
};

module.exports.registerVerify = async (req, res, next) => {
  try {
    const { body } = req;
    const _id = req.session.userId;
    const user = await User.findById(_id);
    const currentOption = req.session.registrationOptions;
    const verification = await verifyRegistration(body, currentOption.challenge);
    const { verified } = verification;

    if (!verified) {
      throw new UnauthorizedError('error');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

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
  } catch (err) {
    next(err);
  }
};

module.exports.authOptions = async (req, res, next) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({
      email: userEmail,
    });
    const userPasskeys = await Passkey.find({ userID: user?._id });
    const options = await getAuthenticationOptions(userPasskeys);
    req.session.authenticationOptions = options;
    req.session.userData = user;
    res.status(200).send(options);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.authVerify = async (req, res, next) => {
  try {
    const response = req.body;
    const user = req.session.userData;
    const currentOption = req.session.authenticationOptions;
    const passkey = await Passkey.findOne({ credentialID: response.id }).orFail(() => {
      throw new UnauthorizedError('Invalid e-mail or passkey');
    });
    const verification = await verifyAuthentication(response, currentOption.challenge, passkey);
    const { verified, authenticationInfo } = verification;
    if (!verified) {
      throw new UnauthorizedError('Invalid e-mail or passkey');
    }
    await Passkey.findByIdAndUpdate(passkey._id, {
      counter: authenticationInfo.counter,
    });
    const token = generateToken(user);
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};
