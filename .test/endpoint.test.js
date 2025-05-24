const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const User = require('../models/user.js');
const { bodyBlacklist } = require('express-winston');

const request = supertest(app);

const validUser = {
  email: 'test@test.com',
  password: 'password123',
  username: 'test123',
};

afterAll(async () => {
  await User.findOneAndDelete({ email: validUser.email });
  await mongoose.connection.close();
});

describe('POST "/signup"', () => {
  it('#SUCCESS - Should create a new user and respond with status 201', async () => {
    const response = await request.post('/signup').send(validUser).set('accept', 'application/json');
    const { status } = response;
    expect(status).toBe(201);
  });
});

describe('GET "/cards/me"', () => {
  it('#SUCCESS - Should respond with user data and status 200', async () => {
    const response = await request.get('/cards/me').set('accept', 'application/json');
    const { header, status, body } = response;
    const { _id, email, username } = body;
    expect(status).toBe(200);
    expect(header['content-type']).toMatch(/json/);
    expect(typeof _id).toBe('string');
    expect(typeof email).toBe('string');
    expect(typeof username).toBe('string');
  });
});
