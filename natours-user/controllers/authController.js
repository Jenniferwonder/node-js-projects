const User = require('../modals/userModal');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
