const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
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
      validate: {
        // NOTE: This only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
  }
  // 💪 Add Virtual Properties
);
// 💪 Add Virtual Properties
// ✅ DOCUMENT MIDDLEWARE: runs before .save() and .create() but not before .insertMany()

// ✅ QUERY MIDDLEWARE: runs before .find()
// });
// ✅ AGGREGATION MIDDLEWARE: runs before .aggregate()

// ✅`Hash Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password using bcrypt, with cost of 10
  const hashedPassword = await bcrypt.hash(this.password, 10);

  // Replace the plain text password with the hashed one
  this.password = hashedPassword;

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined; // required for input not for db
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
