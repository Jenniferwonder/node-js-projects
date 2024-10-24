const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  // checkID,
  // checkBody,
} = require('../controllers/4-tourController-refactor');

// Route handlers
// >>>>>>>>>>>>>> refactored to tourController.js

// Routes
const router = express.Router();
// 1) Add Param middleware to check if ID is valid
// 2) Add checkBody middleware to check if body contains the name and price properties;
// >>>>> 🚀 Removed for checkID and checkBody are not needed in MongoDB

// 💪 Use Alias
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
