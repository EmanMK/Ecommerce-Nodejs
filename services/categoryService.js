const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const CategoryModel = require('../models/categoryModel');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    req.body.image = fileName;
  }
  next();
});

exports.uploadCategoryImage = uploadSingleImage('image');

//@desc   git lsit of category
//@route  GIT /api/v1/category
//@access Public
exports.getCategories = factory.getAll(CategoryModel);

//@desc   git lsit of category
//@route  GIT /api/v1/category/:id
//@access Public
exports.getCategory = factory.getOne(CategoryModel);

//@desc   Create category
//@route  POST /api/v1/category
//@access Private
exports.createCategory = factory.createOne(CategoryModel);

//@desc   Update category
//@route  POST /api/v1/category/:id
//@access private
exports.updateCategory = factory.updateOne(CategoryModel);

//@desc   Delete Category
//@route  Delete /api/v1/category/:id
//access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
