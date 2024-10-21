const Tour = require('../modals/tourModal');

// Route Handlers

// ✅ READ DATA
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

// ✅ UPDATE DATA
exports.updateTour = (req, res) => {};

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
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
