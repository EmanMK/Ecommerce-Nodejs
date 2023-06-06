const ProductModel = require('../models/productModel');
const factory = require('./handlersFactory');

//@desc   git lsit of product
//@route  GIT /api/v1/product
//@access Public
exports.getProducts = factory.getAll(ProductModel, 'product');

//@desc   git lsit of product
//@route  GIT /api/v1/product/:id
//@access Public
exports.getProduct = factory.getOne(ProductModel);

//@desc   Create product
//@route  POST /api/v1/product
//@access Private
exports.createProduct = factory.createOne(ProductModel);
//@desc   Update product
//@route  POST /api/v1/product/:id
//@access private
exports.updateProduct = factory.updateOne(ProductModel);

//@desc   Delete product
//@route  Delete /api/v1/product/:id
//access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);
