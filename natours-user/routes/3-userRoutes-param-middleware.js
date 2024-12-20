const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/1-userController');

// Route handler
// >>>>>>>>>>>>>> 🚀refactored to 1-userController.js

// Routes
const router = express.Router();
// Param middleware
// router.param('id', (req, res, next, val) => {
//   console.log(`User id is: ${val}`);
//   next();
// });

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
