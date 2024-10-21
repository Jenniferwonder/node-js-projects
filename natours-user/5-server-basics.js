const dotenv = require('dotenv');
const app = require('./6-app-serve-static-file');

// This file will also include data config, error handling and environment variables
dotenv.config({ path: './config.env' });
// console.log(app.get('env')); // Set by express
// console.log(process.env); // Return an object of Environment variables in node.js

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
