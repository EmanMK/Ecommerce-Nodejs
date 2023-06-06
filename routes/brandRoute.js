const express = require('express');

const authService = require('../services/authService');

const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require('../utils/validators/brandValidator');

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require('../services/brandService');

const router = express.Router();
router
  .route('/')
  .post(authService.auth, authService.allowedTo('admin'),uploadBrandImage, resizeImage, createBrandValidator, createBrand)
  .get( getBrands);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(authService.auth, authService.allowedTo('admin'),uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(authService.auth, authService.allowedTo('admin'),deleteBrandValidator, deleteBrand);

module.exports = router;
