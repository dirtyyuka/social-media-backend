const User = require('../models/User');

module.exports = async (req, res) => {
  const { query } = req.query;
  try {
    await User.createTable();
    await User.createFollowersTable();
    await User.createFollowingTable();

    const users = await User.getUsersByName(query);
    res.render('search', {
      users
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}