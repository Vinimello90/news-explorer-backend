const mongoose = require('mongoose');

const passkeySchema = new mongoose.Schema({
  credentialID: {
    type: String,
    required: true,
    unique: true,
  },
  publicKey: {
    type: Buffer,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  webauthnUserID: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['singleDevice', 'multiDevice'],
    required: true,
  },
  backedUp: { type: Boolean, required: true },
  transports: {
    type: [String],
    enum: ['ble', 'cable', 'hybrid', 'internal', 'nfc', 'smart-card', 'usb'],
    default: [],
  },
});

module.exports = mongoose.model('Passkey', passkeySchema);
