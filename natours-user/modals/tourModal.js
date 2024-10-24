const mongoose = require('mongoose');
const slugify = require('slugify');
const validators = require('validator');

// ✅ Create a Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [
      //   validators.isAlpha,
      //   'Tour name must only contain alpha characters',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuality: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      // The function is only available on creating document
      validate: {
        validator: function (val) {
          return val < this.price; // 100 < 200
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // 💪 Will remove empty space at the beginning or end of the string
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // 💪 Will not send this field to the response
    },
    startDates: [Date],
    // 💪 Property to test query middleware
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // 💪 Add Virtual Properties
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// 💪 Add Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// ✅ DOCUMENT MIDDLEWARE: runs before .save() and .create() but not before .insertMany()
tourSchema.pre('save', function (next) {
  // console.log(this);
  // this: refer to the document
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', (next) => {
//   console.log('will save document');
//   // this.slug = slugify(this.name, { lower: true });
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// ✅ QUERY MIDDLEWARE: runs before .find()
// tourSchema.pre('find', function (next) {
// To enable this middleware for all queries starting with 'find', eg. find(), findOne(), findByIdAndDelete(),...
tourSchema.pre(/^find/, function (next) {
  // console.log(this);
  // this: refer to the Query object
  this.find({ secretTour: { $ne: true } }); // To prevent secret tour being sent to the client
  this.start = Date.now();
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   console.log(docs);
//   next();
// });
// ✅ AGGREGATION MIDDLEWARE: runs before .aggregate()
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this);
  // this: refer to the Aggregation object
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// ✅ Create an instance of the tour
// const testTour = new Tour({
//   name: 'The Land',
//   rating: 4.7,
//   price: 497,
// });
// const testTour = new Tour({
//   name: 'The Park',
//   price: 300,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR❌:', err);
//   });
