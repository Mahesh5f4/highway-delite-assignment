// Placeholder controller for OTP request and verify
exports.requestOtp = (req, res) => {
  // TODO: Generate OTP, save to DB, send email
  res.json({ message: 'otp_sent' });
};

exports.verifyOtp = (req, res) => {
  // TODO: Validate OTP, create/find user, return JWT
  res.json({ token: 'jwt_token', user: { id: 'user_id', email: req.body.email } });
};
