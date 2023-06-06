const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory required')
    .isLength({ min: 2 })
    .withMessage('Too short subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('categoryId is required')
    .isMongoId()
    .withMessage('Invalid categoryId format'),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('Subcategory id is required')
    .isMongoId()
    .withMessage('Invalid subcategory id format'),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('SubcategoryId is required')
    .isMongoId()
    .withMessage('Invalid SubcategoryId format'),
  check('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Too short subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('categoryId is required')
    .isMongoId()
    .withMessage('Invalid categoryId format'),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('SubcategoryId is required')
    .isMongoId()
    .withMessage('Invalid SubcategoryId format'),
  validatorMiddleware,
];
