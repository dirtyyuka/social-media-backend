const User = require('../models/User');

module.exports = async (req, res) => {
  const friends = await User.getFriendList(req.user.id);
  res.send(friends);
}