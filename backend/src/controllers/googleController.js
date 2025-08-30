// Placeholder controller for Google OAuth
exports.googleAuth = (req, res) => {
  // TODO: Verify Google idToken, create/find user, return JWT
  res.json({ token: 'jwt_token', user: { id: 'user_id', email: 'googleuser@example.com' } });
};
