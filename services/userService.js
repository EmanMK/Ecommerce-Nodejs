const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImage = fileName;
  }

  next();
});

exports.uploadUserImage = uploadSingleImage('profileImage');

//@desc   git lsit of user
//@route  GIT /api/v1/user
//@access Private
exports.getUsers = factory.getAll(UserModel);

//@desc   git lsit of user
//@route  GIT /api/v1/user/:id
//@access Private
exports.getUser = factory.getOne(UserModel);

//@desc   Create user
//@route  POST /api/v1/user
//@access Private
exports.createUser = factory.createOne(UserModel);

//@desc   Update User
//@route  POST /api/v1/user/:id
//@access private
exports.updateUser = factory.updateOne(UserModel);

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document found for this id: ${req.params.id}`, 400));
  }

  res.status(200).json({
    status: 'susccess',
    data: document,
  });
});

//@desc   Delete User
//@route  Delete /api/v1/user/:id
//access  Private
exports.deleteUser = factory.deleteOne(UserModel);

//@desc   Get Loged User Data
//@route  GET /api/v1/user/getMe
//access  Private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc   update Loged User password
//@route  PUT /api/v1/user/changeMyPassword
//access  Private/protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`No user found for this id: ${req.params.id}`, 400));
  }
  const token = createToken({ userId: user._id });
  res.status(200).json({
    token,
    data: user,
  });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`No user found for this id: ${req.params.id}`, 400));
  }
  res.status(200).json({
    data: user,
  });
});
