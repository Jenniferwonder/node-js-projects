// This file will also include data config, error handling and environment variables
const mongoose = require('mongoose');
// ✅ Config Environment Variables
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(app.get('env')); // Set by express
// console.log(process.env); // Return an object of Environment variables in node.js
// const app = require('./9-app-error-handle');
const app = require('./10-app-error-refactor');

// ✅ Connect to MongoDB through Mongoose
// 💪 OPT-1 Connect to local MongoDB
// const DB = 'b'; // Test unhandled rejection
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
// 💪 OPT-2 Connect to MongoDB Altas Cloud
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

// ✅ Start the server
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// ✅ Handle Global Promise Errors
// ✅ Handle Unhandled Rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  // 💯 Graceful shutdown (Needs to be restarted in real application)
  // process.exit(1);
  server.close(() => {
    process.exit(1);
  });
});

// ✅ Handle Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! �� Shutting down...');
  // �� Graceful shutdown (Needs to be restarted in real application)
  // process.exit(1);
  server.close(() => {
    process.exit(1);
  });
});
// console.log(x); // Test uncaught exception
