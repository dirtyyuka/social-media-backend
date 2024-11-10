const User = require('../models/User');

module.exports = async (req, res) => {
  const following = await User.getFollowing(req.user.id);
  res.send(following);
}