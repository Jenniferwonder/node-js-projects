const express = require('express');
const morgan = require('morgan');
// const tourRouter = require('./routes/2-tourRoutes-refactor');
// const userRouter = require('./routes/2-userRoutes-refactor');
const tourRouter = require('./routes/4-tourRoutes-mongo');
const userRouter = require('./routes/3-userRoutes-param-middleware');

const app = express();
// 1) MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// ⭐ Serve static file from folder instead of route
app.use(express.static(`${__dirname}/public`));

// custom middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);

// 2) Route Handlers
// >>>>>>>> refactored to routes/tourRoutes.js & routes/userRoutes.js

// 3) ROUTES (Mount the routers)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVER
// >>>>>>>> refactored to server.js
module.exports = app;
