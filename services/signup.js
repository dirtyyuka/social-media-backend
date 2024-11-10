const User = require('../models/User');
const { createToken } = require('./authentication');

module.exports = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.createTable();
    const user = await User.createUser(name, email, password);
    const token = await createToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 180000,
    }).status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.message === 'Email already exists') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.log(err)
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}