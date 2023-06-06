const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check('name')
  .notEmpty()
  .withMessage('Brand name required')
  .isLength({ min: 3 })
  .withMessage('Too short brand name')
  .isLength({ max: 32 })
  .withMessage('Too long brand name')
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
