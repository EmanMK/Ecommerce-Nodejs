const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIREING_TIME,
  });

module.exports = createToken;
