const jwt = require('jsonwebtoken');
const User = require('../modals/userModal');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  // 💪Prevent security flaw (can't send other properties like role as admin)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // ✅ Create JWT token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // Set the token as a cookie
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
  });
  // Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
