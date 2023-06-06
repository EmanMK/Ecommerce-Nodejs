const express = require('express');

const authService = require('../services/authService')

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryId,
  createfilterObject,
  uploadSubCategoryImage,
  resizeImage,
} = require('../services/subCategoryService');

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');

// mergeParams option is to access params from nested routes
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authService.auth, authService.allowedTo('admin'),
    uploadSubCategoryImage,
    resizeImage,
    setCategoryId,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createfilterObject, getSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(authService.auth, authService.allowedTo('admin'),uploadSubCategoryImage, resizeImage, updateSubCategoryValidator, updateSubCategory)
  .delete(authService.auth, authService.allowedTo('admin'),deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
