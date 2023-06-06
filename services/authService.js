const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEamil = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

//@desc   signup
//@route  GET /api/v1/auth/signup
//@access public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.name,
    password: req.body.password,
  });

  const token = createToken({ userId: user._id });

  res.status(201).json({ token, data: user });
});

//@desc   login
//@route  GET /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return next(new ApiError('Incorrect email or password', 401));

  const token = createToken({ userId: user._id });

  res.status(201).json({ token, data: user });
});

exports.auth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ApiError('you are not logedin, please login to get access to this route'), 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) return next(new ApiError('this user no longer exist', 401));

  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    if (passwordChangedTimeStamp > decoded.iat)
      return next(new ApiError('user recently changed his password, please login again'), 401);
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError("You're not allowed to access this route", 403));
    next();
  });

//@desc   Forgot Password
//@route  POST /api/auth/forgotpassword
//@access Pulic
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return next(new ApiError('Incorrect email, user with this email is not found', 404));

  //2)generate reset code -> hash it -> save it to db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  //3)send reset code via email
  const message = `Hello ${user.name},\n We recieved a request to reset the password on your E-shop account,\n here is Your password reset code (valid for 10 min ) : ${resetCode}  `;
  try {
    await sendEamil({ email: user.email, subject: 'Reset password code', message });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new ApiError('there is error in sending email', 500));
  }

  res.status(200).json({ msg: `reset code has been sent to email : ${user.email}` });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  //1)get user based on reset code
  const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new ApiError('Invalid reset code or expired', 400));

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    msg: 'reset code is valid',
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return next(new ApiError('No user found with this email', 404));

  if (user.passwordResetVerified === false)
    return next(new ApiError('Reset code not verified', 400));

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //generate token
  const token = createToken({ userId: user._id });
  res.status(200).json({ token });
});
