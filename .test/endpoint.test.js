const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const User = require('../models/user.js');

const request = supertest(app);

const validUser = {
  email: 'test@test.com',
  password: 'password123',
  username: 'test123',
};

let token;

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

describe('POST "/signin"', () => {
  it('#SUCCESS - Should authenticate a user and respond with a token and status 201', async () => {
    const response = await request
      .post('/signin')
      .send({ email: validUser.email, password: validUser.password })
      .set('accept', 'application/json');
    const { status, header, body } = response;
    token = body.token;
    expect(status).toBe(200);
    expect(header['content-type']).toMatch(/json/);
    expect(body).toHaveProperty('token');
  });
});

describe('GET "/users/me"', () => {
  it('#SUCCESS - Should respond with user data and status 200', async () => {
    const response = await request
      .get('/users/me')
      .set('accept', 'application/json')
      .set('authorization', `Bearer ${token}`);
    const { header, status, body } = response;
    const { _id, email, username } = body;
    expect(status).toBe(200);
    expect(header['content-type']).toMatch(/json/);
    expect(typeof _id).toBe('string');
    expect(typeof email).toBe('string');
    expect(typeof username).toBe('string');
  });
});
