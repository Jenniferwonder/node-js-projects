const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/1-userController');
const { signup } = require('../controllers/authController');

// Route handler
// >>>>>>>>>>>>>> 🚀refactored to 1-userController.js

// Routes
const router = express.Router();
router.post('/signup', signup);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;