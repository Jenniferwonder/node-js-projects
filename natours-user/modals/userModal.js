const mongoose = require('mongoose');
const validator = require('validator');
// const slugify = require('slugify');

// name, email, photo, password, passwordConfirm

// ✅ Create a Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      // select: false, // This field won't be returned in the API response
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      // validate: {
      //   validator: function (el) {
      //     return el === this.password;
      //   },
      //   message: 'Passwords are not the same',
      // },
    },
  }
  // 💪 Add Virtual Properties
);
// 💪 Add Virtual Properties
// ✅ DOCUMENT MIDDLEWARE: runs before .save() and .create() but not before .insertMany()

// ✅ QUERY MIDDLEWARE: runs before .find()
// });
// ✅ AGGREGATION MIDDLEWARE: runs before .aggregate()
const User = mongoose.model('User', userSchema);

module.exports = User;
