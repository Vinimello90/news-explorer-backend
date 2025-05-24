const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
require('dotenv').config();

const { API_PORT, DATABASE_URL } = process.env;

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connection established'))
  .catch(() => console.error('Failed to connect to MongoDB'));

const app = express();

const { PORT = API_PORT } = process.env;

app.use(express.json());

app.use('/cards', usersRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'The request was not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening to port ${API_PORT}`);
  });
}

module.exports = app;
