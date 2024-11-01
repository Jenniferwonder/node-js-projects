const Tour = require('../modals/tourModal');
const APIFeatures = require('../utils/apiFeatures');
// ✅ Catch Error in all Async functions
// ⭐ Replace try...catch with catchAsync: delete all code in catch block but keep code only in the try block
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Route Handlers
// ✅ USE ALIAS MIDDLEWARE
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ✅ READ DATA
exports.getAllTours = catchAsync(async (req, res, next) => {
  // 🟢BUILD QUERY
  // >>>>>>>> 🚀 Refactored to utils/apiFeatures.js
  // 🟢EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  // const tours = await query;
  // query.find().select().skip().limit().sort()

  // 🟢SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id:req.params.id})
  // 💪 Handle 404 Errors
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

// ✅ UPDATE DATA
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // 💪 Handle 404 Errors
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

// ✅ CREATE DATA

exports.createTour = catchAsync(async (req, res, next) => {
  // 💪OPT-3 Using Async function
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newTour,
  });
});

// ✅ DELETE DATA
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id, {
    new: true,
  });
  // 💪 Handle 404 Errors
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ✅ AGGREGATION PIPELINE: GET TOUR STATUS
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty', // Property to group by
        _id: { $toUpper: '$difficulty' }, // Property to group by
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1, // ASC
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }, // ne: NOT EQUAL TO
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats: stats },
  });
});

// ✅ AGGREGATION PIPELINE: GET BUSIEST MONTH DATA
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Split into different documents according to the field startDates
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // Property to group by
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // Hide, use 1 to Show
      },
    },
    {
      $sort: {
        numTourStarts: -1, // 1: ASC; -1: DESC
      },
    },
    // {
    //   $limit: 6, // Limit the results to 6
    // },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }, // ne: NOT EQUAL TO
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
