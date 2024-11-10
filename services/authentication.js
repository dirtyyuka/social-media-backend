const jwt = require('jsonwebtoken');

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10min',
  });
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = { createToken, validateToken };