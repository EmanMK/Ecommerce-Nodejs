const { check } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const UserModel = require('../../models/userModel');
const ApiError = require('../apiError');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id'),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check('profileImage').optional(),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accept for Egy and SA'),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
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
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accept for Egy and SA'),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id'),
  check('currentPassword')
    .notEmpty()
    .withMessage('you must enter your current passwford')
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('there is no user for this id');
      }

      const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);

      if (!isCorrectPassword) {
        throw new Error('Incorrect Current Password');
      }
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
