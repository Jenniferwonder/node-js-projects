const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  // checkID,
  // checkBody,
} = require('../controllers/6-tourController-errorHandle');

// Route handlers
// >>>>>>>>>>>>>> refactored to tourController.js

// Routes
const router = express.Router();
// 1) Add Param middleware to check if ID is valid
// 2) Add checkBody middleware to check if body contains the name and price properties;
// >>>>> 🚀 Removed for checkID and checkBody are not needed in MongoDB

// 💪 Use Aggregation middleware
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
// 💪 Use Alias
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
