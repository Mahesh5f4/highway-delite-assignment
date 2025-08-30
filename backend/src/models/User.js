const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  picture: { type: String },
  provider: { type: String, enum: ['EMAIL', 'GOOGLE'], required: true },
  googleSub: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
