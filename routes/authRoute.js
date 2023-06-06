const express = require('express');
const { signupValidator,loginValidator } = require('../utils/validators/authValidator');

const { signup,login, forgotPassword ,verifyPasswordResetCode,resetPassword} = require('../services/authService');

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/forgotpassword').post(forgotPassword);
router.post('/verifyPasswordResetCode',verifyPasswordResetCode);
router.put('/resetPassword',resetPassword);

module.exports = router;
