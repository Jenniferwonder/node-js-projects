const jwt = require('jsonwebtoken');
const User = require('../modals/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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
  // 🏷️Refactored to signToken above
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = signToken(newUser._id);
  // Set the token as a cookie
  // res.cookie('jwt', token, {
  //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  //   httpOnly: true,
  // });
  // Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
// ✅ Log in user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); // 💪 select excluded password field
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401: unauthorized
  }
  // 3) If everything ok, send token to client
  // 🏷️Refactored to signToken above
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = signToken(user._id);
  // Set the token as a cookie
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
  });
  // Send response
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});
