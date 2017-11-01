import request from 'supertest-as-promised';
import { signSync } from '../../services/jwt';
import express from '../../services/express';
import routes, { User } from '.';

const app = () => express(routes);

let user1, user2, session1, session2;

beforeEach(async () => {
  user1 = await User.create({
    name: 'user',
    email: 'a@a.com',
    password: '123456',
    phone: '0600000000'
  });
  user2 = await User.create({
    name: 'user',
    email: 'b@b.com',
    password: '123456',
    phone: '0600000000'
  });
  session1 = signSync(user1.id);
  session2 = signSync(user2.id);
});

test('GET /users 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: session1 });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
});

test('GET /users?page=2&limit=1 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: session1, page: 2, limit: 1 });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBe(1);
});

test('GET /users?q=user 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: session1, q: 'user' });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBe(2);
});

test('GET /users?fields=name 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: session1, fields: 'name' });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
  expect(Object.keys(body[0])).toEqual(['id', 'name']);
});

test('GET /users 401', async () => {
  const { status } = await request(app()).get('/');
  expect(status).toBe(401);
});

test('GET /users/me 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/me')
    .query({ access_token: session1 });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.id).toBe(user1.id);
});

test('GET /users/me 401', async () => {
  const { status } = await request(app()).get('/me');
  expect(status).toBe(401);
});

test('GET /users/:id 200', async () => {
  const { status, body } = await request(app()).get(`/${user1.id}`);
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.id).toBe(user1.id);
});

test('GET /users/:id 404', async () => {
  const { status } = await request(app()).get('/123456789098765432123456');
  expect(status).toBe(404);
});

test('POST /users 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ email: 'd@d.com', password: '123456', phone: '0600000000' });
  expect(status).toBe(201);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('d@d.com');
});

test('POST /users 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({
      email: 'd@d.com',
      password: '123456',
      phone: '0600000000'
    });
  expect(status).toBe(201);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('d@d.com');
});

test('POST /users 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({
      email: 'd@d.com',
      password: '123456',
      phone: '0600000000'
    });
  expect(status).toBe(201);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('d@d.com');
});

test('PUT /users/me 200 (user)', async () => {
  const { status, body } = await request(app())
    .put('/me')
    .send({ access_token: session1, name: 'test' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.name).toBe('test');
});

test('PUT /users/me 200 (user)', async () => {
  const { status, body } = await request(app())
    .put('/me')
    .send({ access_token: session1, email: 'test@test.com' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('a@a.com');
});

test('PUT /users/me 401', async () => {
  const { status } = await request(app())
    .put('/me')
    .send({ name: 'test' });
  expect(status).toBe(401);
});

test('PUT /users/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${user1.id}`)
    .send({ access_token: session1, name: 'test' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.name).toBe('test');
});

test('PUT /users/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${user1.id}`)
    .send({ access_token: session1, email: 'test@test.com' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('a@a.com');
});

test('PUT /users/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${user1.id}`)
    .send({ access_token: session2, name: 'test' });
  expect(status).toBe(401);
});

test('PUT /users/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${user1.id}`)
    .send({ name: 'test' });
  expect(status).toBe(401);
});

const passwordMatch = async (password, userId) => {
  const user = await User.findById(userId);
  return !!await user.authenticate(password);
};

test('PUT /users/me/password 200 (user)', async () => {
  const { status, body } = await request(app())
    .put('/me/password')
    .auth('a@a.com', '123456')
    .send({ password: '654321' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('a@a.com');
  expect(await passwordMatch('654321', body.id)).toBe(true);
});

test('PUT /users/me/password 400 (user) - invalid password', async () => {
  const { status, body } = await request(app())
    .put('/me/password')
    .auth('a@a.com', '123456')
    .send({ password: '321' });
  expect(status).toBe(400);
  expect(typeof body).toBe('object');
  expect(body.param).toBe('password');
});

test('PUT /users/me/password 401 (user) - invalid authentication method', async () => {
  const { status } = await request(app())
    .put('/me/password')
    .send({ access_token: session1, password: '654321' });
  expect(status).toBe(401);
});

test('PUT /users/me/password 401', async () => {
  const { status } = await request(app())
    .put('/me/password')
    .send({ password: '654321' });
  expect(status).toBe(401);
});

test('PUT /users/:id/password 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${user1.id}/password`)
    .auth('a@a.com', '123456')
    .send({ password: '654321' });
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
  expect(body.email).toBe('a@a.com');
  expect(await passwordMatch('654321', body.id)).toBe(true);
});

test('PUT /users/:id/password 400 (user) - invalid password', async () => {
  const { status, body } = await request(app())
    .put(`/${user1.id}/password`)
    .auth('a@a.com', '123456')
    .send({ password: '321' });
  expect(status).toBe(400);
  expect(typeof body).toBe('object');
  expect(body.param).toBe('password');
});

test('PUT /users/:id/password 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${user1.id}/password`)
    .auth('b@b.com', '123456')
    .send({ password: '654321' });
  expect(status).toBe(401);
});

test('PUT /users/:id/password 401 (user) - invalid authentication method', async () => {
  const { status } = await request(app())
    .put(`/${user1.id}/password`)
    .send({ access_token: session1, password: '654321' });
  expect(status).toBe(401);
});

test('PUT /users/:id/password 401', async () => {
  const { status } = await request(app())
    .put(`/${user1.id}/password`)
    .send({ password: '654321' });
  expect(status).toBe(401);
});

test('PUT /users/:id/password 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456/password')
    .auth('a@a.com', '123456')
    .send({ password: '654321' });
  expect(status).toBe(404);
});
