// This file will also include data config, error handling and environment variables
const mongoose = require('mongoose');
// ✅ Config Environment Variables
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(app.get('env')); // Set by express
// console.log(process.env); // Return an object of Environment variables in node.js

const app = require('./6-app-serve-static-file');
// ✅ Connect to MongoDB through Mongoose
// 🚀 OPT-1 Connect to local MongoDB
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });
// 🚀 OPT-2 Connect to MongoDB Altas Cloud
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     // console.log(connection.connections);
//     console.log('DB connection successful');
//   });
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
const testTour = new Tour({
  name: 'The Park',
  price: 300,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR❌:', err);
  });
// ✅ Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
