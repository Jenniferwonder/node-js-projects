const mongoose = require('mongoose');

// ✅ Create a Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);

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

module.exports = Tour;
