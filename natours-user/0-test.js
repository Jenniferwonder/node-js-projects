const app = require('express')();

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side!');
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' }); // Will automatically convert Content-Type to JSON format
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
