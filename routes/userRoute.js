const express = require('express');

const authService = require('../services/authService');
const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData
} = require('../services/userService');

const router = express.Router();
router.get('/getMe', authService.auth, getLoggedUserData, getUserValidator, getUser);
router.put('/changeMyPassword',authService.auth, authService.allowedTo('user'), changeLoggedUserPassword);
router.put('/updateMe',authService.auth, authService.allowedTo('user'),updateLoggedUserValidator, updateLoggedUserData);
router.route('/').post(uploadUserImage, resizeImage, createUserValidator, createUser).get(getUsers);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(
    authService.auth,
    authService.allowedTo('user', 'admin'),
    deleteUserValidator,
    deleteUser
  );
router.route('/changepassword/:id').put(changePasswordValidator, changeUserPassword);

module.exports = router;
