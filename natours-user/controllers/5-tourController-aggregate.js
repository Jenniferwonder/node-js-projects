const Tour = require('../modals/tourModal');
const APIFeatures = require('../utils/apiFeatures');

// Route Handlers
// ✅ USE ALIAS MIDDLEWARE
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ✅ READ DATA
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id})

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// ✅ UPDATE DATA
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// ✅ CREATE DATA
/* exports.createTour = (req, res) => {
  // 💪OPT-1
  // const newTour = new Tour({});
  // newTour.save();
  // 💪OPT-2 Using Promise
  // Tour.create({}).then().catch()
}; */

exports.createTour = async (req, res) => {
  // 💪OPT-3 Using Async function
  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      // message: 'Invalid data sent',
      message: err.message,
    });
  }
};

// ✅ DELETE DATA
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, {
      new: true,
    });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// ✅ AGGREGATION PIPELINE: GET TOUR STATUS
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// ✅ AGGREGATION PIPELINE: GET BUSIEST MONTH DATA
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
