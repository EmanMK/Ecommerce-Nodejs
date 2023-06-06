const express = require('express');

const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validators/categoryValidator');
const subCategoryRoute = require('./subCategoryRoute');

const authService = require('../services/authService')

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require('../services/categoryService');

const router = express.Router();

router.use('/:categoryId/subcategory', subCategoryRoute);
router
  .route('/')
  .post(authService.auth, authService.allowedTo('admin'),uploadCategoryImage, resizeImage, createCategoryValidator, createCategory)
  .get(getCategories);
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(authService.auth, authService.allowedTo('admin'),uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(authService.auth, authService.allowedTo('admin'),deleteCategoryValidator, deleteCategory);

module.exports = router;
