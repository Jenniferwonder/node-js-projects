const express = require('express');
const morgan = require('morgan'); // 🛠️ Log tool
// const tourRouter = require('./routes/2-tourRoutes-refactor');
// const userRouter = require('./routes/2-userRoutes-refactor');
// const tourRouter = require('./routes/4-tourRoutes-mongo');
// const tourRouter = require('./routes/5-tourRoutes-alias');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/6-tourRoutes-aggregate');
const userRouter = require('./routes/3-userRoutes-param-middleware');

const app = express();
// 1) ✅ MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// 💪 Serve static file from folder instead of route
app.use(express.static(`${__dirname}/public`));

// 💪 custom middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);

// 2) ✅ Route Handlers
// >>>>>>>> refactored to routes/tourRoutes.js & routes/userRoutes.js

// 3) ✅ ROUTES (Mount the routers)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 💪 Handle undefined routes
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  }); */
  /* const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err); */
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 💪 Global error handler: 1) create a middleware 2) create an error that the function will handle
app.use(globalErrorHandler);
/* app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // internal server error
  err.status = err.status || 'error';

  res.status(500).json({
    status: err.status,
    message: err.message,
  });
}); */

// 4) ✅ START SERVER
// >>>>>>>> refactored to server.js
module.exports = app;
