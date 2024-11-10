const User = require('../models/User');

module.exports = async (req, res) => {
  const followers = await User.getFollowers(req.user.id);
  res.send(followers);
}