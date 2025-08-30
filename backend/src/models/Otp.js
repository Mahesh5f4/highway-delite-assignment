const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'login'], required: true },
  expiresAt: { type: Date, required: true },
  consumed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Otp', otpSchema);
