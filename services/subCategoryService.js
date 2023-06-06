const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const SubCategoryModel = require('../models/subCategoryModel');
const factory = require('./handlersFactory');

const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `subcategory-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/subcategories/${fileName}`);

  req.body.image = fileName;}
  next();
});

exports.uploadSubCategoryImage = uploadSingleImage('image');

exports.setCategoryId = (req, res, next) => {
  if (req.params.categoryId) req.body.category = req.params.categoryId;
  next();
};

exports.createfilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

//@desc   Create subCategory
//@route  POST /api/v1/subcategory
//@access Private
exports.createSubCategory = factory.createOne(SubCategoryModel);

// GET /api/vf1/category/:catoryId/subcategories
//@desc   get subCategories
//@route  GET /api/v1/subcategory
//@access Public
exports.getSubCategories = factory.getAll(SubCategoryModel);

//@desc   get subCategory
//@route  GET /api/v1/subcategory/:id
//@access Public
exports.getSubCategory = factory.getOne(SubCategoryModel);
//@desc   Update subCategory
//@route  PUT /api/v1/subcategory/:id
//@access Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel);

//@desc   Update subCategory
//@route  DELETE /api/v1/subcategory/:id
//@access Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
