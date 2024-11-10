const jwt = require('jsonwebtoken');
const { validateToken } = require('../services/authentication');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const user = await validateToken(token);
      const userData = await User.getUserById(user.id);
      if (userData) {
        req.user = userData;
      }
    } catch (err) {}
  }
  next();
}