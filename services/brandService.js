const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const BrandModel = require('../models/brandModel');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;}
  next();
});

exports.uploadBrandImage = uploadSingleImage('image');

//@desc   git lsit of brand
//@route  GIT /api/v1/brand
//@access Public
exports.getBrands = factory.getAll(BrandModel);

//@desc   git lsit of brand
//@route  GIT /api/v1/brand/:id
//@access Public
exports.getBrand = factory.getOne(BrandModel);

//@desc   Create brand
//@route  POST /api/v1/brand
//@access Private
exports.createBrand = factory.createOne(BrandModel);

//@desc   Update brand
//@route  POST /api/v1/brand/:id
//@access private
exports.updateBrand = factory.updateOne(BrandModel);

//@desc   Delete brand
//@route  Delete /api/v1/brand/:id
//access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
