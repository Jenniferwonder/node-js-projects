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
      message: 'Invalid data sent',
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
      message: err,
    });
  }
};
