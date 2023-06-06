const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require('../utils/validators/productValidator');

const authService = require('../services/authService')

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

const router = express.Router();

router.route('/').post(authService.auth, authService.allowedTo('admin'),createProductValidator, createProduct).get(getProducts);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(authService.auth, authService.allowedTo('admin'),updateProductValidator, updateProduct)
  .delete(authService.auth, authService.allowedTo('admin'),deleteProductValidator, deleteProduct);

module.exports = router;
