const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');

const request = supertest(app);

afterAll(async () => {
  await mongoose.connection.close();
});

const user = {
  email: 'test@test.com',
  password: 'password123',
  username: 'test123',
};

describe('POST "/signup"', () => {
  it('#SUCCESS - Should create a new user and respond with status 201', async () => {
    const response = await request.post('/signup').send(user).set('accept', 'application/json');
    const { header, status } = response;
    expect(header['content-type']).toMatch(/json/);
    expect(status).toBe(201);
  });
});
