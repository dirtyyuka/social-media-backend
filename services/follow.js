const User = require('../models/User');

module.exports = async (req, res) => {
  const followerId = req.params.id;
  const followingId = req.user.id;

  try {
    await User.follow(followingId, followerId);
    res.status(200).json({ message: 'User followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}