const express = require('express');
const morgan = require('morgan');
// const tourRouter = require('./routes/2-tourRoutes-refactor');
// const userRouter = require('./routes/2-userRoutes-refactor');
const tourRouter = require('./routes/3-tourRoutes-param-middleware');
const userRouter = require('./routes/3-userRoutes-param-middleware');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

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
