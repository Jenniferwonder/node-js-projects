const fs = require('node:fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
// Route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  // >>> 🚀refactored to checkID
  // console.log(req.params);
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid ID',
  //   });
  // }
  const tour = tours.find((el) => el.id === req.params.id * 1);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  // >>> 🚀refactored to checkID
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  const updatedTour = tours.map((el) => {
    if (el.id === req.params.id * 1) {
      return { ...el, ...req.body };
    }
    return el;
  });

  fs.writeFile(
    '../dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({
        status: 'success',
        data: {
          updatedTour,
        },
      });
    }
  );
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    '../dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.deleteTour = (req, res) => {
  // >>>> 🚀refactored to checkID
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
