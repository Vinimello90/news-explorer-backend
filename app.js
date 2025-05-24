const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { API_PORT, DATABASE_URL } = process.env;

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connection established'))
  .catch(() => console.error('Failed to connect to MongoDB'));

const app = express();

const { PORT = API_PORT } = process.env;

app.listen(PORT, () => {
  console.log(`App listening to port ${API_PORT}`);
});
