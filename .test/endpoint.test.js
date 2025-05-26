const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const User = require('../models/user.js');
const Article = require('../models/article.js');

const request = supertest(app);

const validUser = {
  email: 'test@test.com',
  password: 'password123',
  username: 'test123',
};

let token;
let articleURL;

afterAll(async () => {
  await User.findOneAndDelete({ email: validUser.email });
  await Article.findOneAndDelete({ url: articleURL });
  await mongoose.connection.close();
});

describe('POST "/signup"', () => {
  it('#SUCCESS - Should create a new user and respond with status 201', async () => {
    const response = await request
      .post('/signup')
      .send(validUser)
      .set('accept', 'application/json');
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

describe('POST "/articles"', () => {
  it('#SUCCESS - Should create a new article and respond with new article data and status 201', async () => {
    const response = await request
      .post('/articles')
      .send({
        title:
          'Tecnologia ajudou a mudar debate sobre OVNIs, afirma ex-Pentágono',
        description:
          'Luis Elizondo, ex-Pentágono, afirmou à CNN que avanços tecnológicos e nova geração abriram espaço para debater OVNIs\nO post Tecnologia ajudou a mudar debate sobre OVNIs, afirma ex-Pentágono apareceu primeiro em Olhar Digital.',
        keyword: 'tecnologia',
        source: 'Olhardigital.com.br',
        url: 'https://olhardigital.com.br/2025/05/19/ciencia-e-espaco/tecnologia-ajudou-a-mudar-debate-sobre-ovnis-afirma-ex-pentagono/',
        urlToImage:
          'https://olhardigital.com.br/wp-content/uploads/2025/05/ovni.jpg',
        publishedAt: '2025-05-19T18:31:18Z',
      })
      .set('accept', 'application/json')
      .set('authorization', `Bearer ${token}`);
    const { status, header, body } = response;
    const {
      title,
      description,
      keyword,
      source,
      url,
      urlToImage,
      publishedAt,
    } = body;
    articleURL = url;
    console.log(articleURL);
    expect(status).toBe(201);
    expect(header['content-type']).toMatch(/json/);
    expect(typeof title).toBe('string');
    expect(typeof description).toBe('string');
    expect(typeof keyword).toBe('string');
    expect(typeof source).toBe('string');
    expect(typeof url).toBe('string');
    expect(typeof urlToImage).toBe('string');
    expect(typeof publishedAt).toBe('string');
  });
});

describe('GET "/articles"', () => {
  it('#SUCCESS - Should fetch a list of articles with authenticated user ID and respond with articles data and status 200', async () => {
    const response = await request
      .get('/articles')
      .set('accept', 'application/json')
      .set('authorization', `Bearer ${token}`);
    const { status, header, body } = response;
    expect(status).toBe(200);
    body.forEach((article) => {
      const {
        title,
        description,
        keyword,
        source,
        url,
        urlToImage,
        publishedAt,
      } = article;
      expect(header['content-type']).toMatch(/json/);
      expect(typeof title).toBe('string');
      expect(typeof description).toBe('string');
      expect(typeof keyword).toBe('string');
      expect(typeof source).toBe('string');
      expect(typeof url).toBe('string');
      expect(typeof urlToImage).toBe('string');
      expect(typeof publishedAt).toBe('string');
    });
  });
});
