const express = require('express');
const tourRouter = require('./routes/1-tourRoutes');
const userRouter = require('./routes/1-userRoutes');

const app = express();

// 1) MIDDLEWARES
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
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
