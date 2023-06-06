const { check } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const UserModel = require('../../models/userModel');
const ApiError = require('../apiError');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Too short user name')
    .isLength({ max: 32 })
    .withMessage('Too long user name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val, { req }) => {
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError('email is already in use'), 400);
        }
      });
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 4 })
    .withMessage('Too short password must be at least 4 characters'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password Confirmation required')
    .isLength({ min: 4 })
    .withMessage('Too short password must be at least 4 characters')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password is not equal to password Confirmation');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 4 })
    .withMessage('Too short password must be at least 4 characters'),

  validatorMiddleware,
];
