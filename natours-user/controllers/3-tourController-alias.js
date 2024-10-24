const Tour = require('../modals/tourModal');

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
    // 🟢Get all tours
    // const tours = await Tour.find();
    // 🟢BUILD QUERY
    // Exclude some fields from query
    const queryObj = { ...req.query }; // Shallow copy the original obj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);
    // 💪 Advanced filtering
    // To support "127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=500"
    // gte: greater than equal; gt; lte, lt
    // use regExp to replace the above keywords with $ assigned
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // 💪 OPT-1 Filter with query string
    let query = Tour.find(JSON.parse(queryStr));
    // const query = Tour.find(queryObj); // Will return a Query object
    // 💪 OPT-2 Filter with MongoDB query
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // 💪 Sorting
    // Sort ASC: 127.0.0.1:3000/api/v1/tours?sort=price
    // Sort DESC: 127.0.0.1:3000/api/v1/tours?sort=-price
    // Sort BY FIELDs: 127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
    if (req.query.sort) {
      // query = query.sort(req.query.sort);
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Sort by default field
      query = query.sort('-createdAt');
    }
    // 💪 Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // Prevent "__v" field used by Mongoose sent to the client
      // 🚀 To exclude field permanently, go to "models/tourModel.js"
      query = query.select('-__v');
    }
    // 💪 Pagination
    // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    // 🟢EXECUTE QUERY
    const tours = await query;
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
