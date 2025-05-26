require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./utils/errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { API_PORT, DATABASE_URL } = process.env;

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connection established'))
  .catch(() => console.error('Failed to connect to MongoDB'));

const app = express();

const { PORT = API_PORT } = process.env;

app.use(express.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('The request was not found.'));
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening to port ${API_PORT}`);
  });
}

module.exports = app;
