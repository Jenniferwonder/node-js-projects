const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('../controllers/1-tourController');

// Route handlers
// >>>>>>>>>>>>>> 🚀refactored to 1-tourController.js

// Routes
const router = express.Router();
// 1) Add Param middleware to check if ID is valid
// It will run if id exists in url
router.param('id', checkID);

// 2) Add checkBody middleware to check if body contains the name and price properties;
// if not, send back 400 (bad request)
// Add it to the pots handler stack
router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
