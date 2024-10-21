const fs = require('node:fs');
const express = require('express');

const app = express();

// MIDDLEWARES
// Stand between a request and a response
// Change JSON into an array of objects
app.use(express.json());

// parse json data into an array of objects
const tours = JSON.parse(fs.readFileSync('../dev-data/data/tours-simple.json'));

// GET ALL TOURS
app.get('/api/v1/tours', (req, res) => {
  // res.status(200).send('Hello from the server side!');
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  }); // Will automatically convert Content-Type to JSON format
});

// Get one tour
// ✅Optional parameters: add "?""
// app.get('/api/v1/tours/:id?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  }); // Will automatically convert Content-Type to JSON format
});

// Patch
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // Update the tour
  const updatedTour = tours.map((el) => {
    if (el.id === id) {
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
});

// Post: CREATE NEW TOUR
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
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
  // res.send('Done');
});

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
