const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
  console.log(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  next();
};

module.exports = validatorMiddleware;
