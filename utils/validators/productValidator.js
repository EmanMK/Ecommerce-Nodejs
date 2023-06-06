const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id'),
  validatorMiddleware,
];

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('product required')
    .isLength({ min: 3 })
    .withMessage('Too short product title')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too Long product description'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product qauntity must be a number'),
  check('sold').optional().isNumeric().withMessage('Product sold quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Product Price is required')
    .isNumeric()
    .withMessage('Product Price must be a number')
    .isLength({ max: 100000 })
    .withMessage('Too Long Pirce name'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat(),
  check('colors').optional().isArray().withMessage('colors should be array of string'),
  check('imageCover').notEmpty().withMessage('Product Price is required'),
  check('images').optional().isArray().withMessage('images should be array of string'),
  check('category')
    .isMongoId()
    .withMessage('Invalid category id format')
    .notEmpty()
    .withMessage('Product must belong to category')
    .custom((value) =>
      CategoryModel.findById(value).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`No category for this id: ${value}`));
        }
      })
    ),
  check('subCategory')
    .optional()
    .isMongoId()
    .withMessage('Invalid subCategory id format')
    .custom((value, { req }) =>
      SubCategoryModel.find({ _id: { $exists: true, $in: value } }).then((subCategories) => {
        if (subCategories.length < 1 || subCategories.length !== value.length) {
          return Promise.reject(new Error(`No all subCategories axist in db`));
        }
      })
    )
    .custom((value, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then((subCategories) => {
        const subCategoriesIdsInDB = [];
        subCategories.forEach((subCategory) => {
          subCategoriesIdsInDB.push(subCategory._id.toString());
        });
        if (!value.every((el) => subCategoriesIdsInDB.includes(el)))
          return Promise.reject(new Error(`Not all subCategories belong to above category`));
      })
    ),
  check('brand').optional().isMongoId().withMessage('Invalid brand id format'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('RaingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity').optional().isNumeric().withMessage('RaingsQuantity must be a number'),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
