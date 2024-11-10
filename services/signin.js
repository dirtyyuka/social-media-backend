const User = require('../models/User');
const { createToken } = require('./authentication');
module.exports = async (req, res) => {
  const { email, password } = req.body;

  //* validate user
  try {
    await User.createTable();
    const user = await User.getUser(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const token = await createToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 600000,
      }).status(200).json({ message: 'User logged in successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}