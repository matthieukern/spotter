import request from 'supertest-as-promised';
import { signSync } from '../../services/jwt';
import express from '../../services/express';
import { User } from '../user';
import routes, { Spot } from '.';

const app = () => express(routes);

let userSession, anotherSession, spot;

beforeEach(async () => {
  const user = await User.create({
    email: 'a@a.com',
    password: '123456',
    phone: '0600000000'
  });
  const anotherUser = await User.create({
    email: 'b@b.com',
    password: '123456',
    phone: '0600000000'
  });
  userSession = signSync(user.id);
  anotherSession = signSync(anotherUser.id);
  spot = await Spot.create({
    user,
    location: [48.8618256, 2.37801079999997],
    photo: 'example.com'
  });
});

test('POST /spots 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({
      access_token: userSession,
      location: [40.848447, -73.856077],
      photo: 'example.com'
    });
  expect(status).toBe(201);
  expect(typeof body).toEqual('object');
  expect(body.location).toEqual([-73.856077, 40.848447]);
  expect(body.photo).toEqual('example.com');
  expect(typeof body.user).toEqual('object');
});

test('POST /spots 401', async () => {
  const { status } = await request(app()).post('/');
  expect(status).toBe(401);
});

test('GET /spots 200 (user)', async () => {
  const user = await User.create({
    email: 'c@c.com',
    password: '123456',
    phone: '0600000000'
  });
  await Spot.create({
    user,
    location: [48.8623959, 2.37955],
    photo: 'example.com'
  });

  const { status, body } = await request(app())
    .get('/?near=48.8596019,2.3828995000000077')
    .query({ access_token: userSession });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
  expect(typeof body[0].user).toEqual('object');
});

test('GET /spots 401', async () => {
  const { status } = await request(app()).get('/');
  expect(status).toBe(401);
});

test('GET /spots/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${spot.id}`)
    .query({ access_token: userSession });
  expect(status).toBe(200);
  expect(typeof body).toEqual('object');
  expect(body.id).toEqual(spot.id);
  expect(typeof body.user).toEqual('object');
});

test('GET /spots/:id 401', async () => {
  const { status } = await request(app()).get(`/${spot.id}`);
  expect(status).toBe(401);
});

test('GET /spots/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession });
  expect(status).toBe(404);
});

test('PUT /spots/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${spot.id}`)
    .send({
      access_token: userSession,
      location: [-73.856077, 40.848447],
      photo: 'test'
    });
  expect(status).toBe(200);
  expect(typeof body).toEqual('object');
  expect(body.id).toEqual(spot.id);
  expect(body.location).toEqual([-73.856077, 40.848447]);
  expect(body.photo).toEqual('test');
  expect(typeof body.user).toEqual('object');
});

test('PUT /spots/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${spot.id}`)
    .send({
      access_token: anotherSession,
      location: [-73.856077, 40.848447],
      photo: 'test'
    });
  expect(status).toBe(401);
});

test('PUT /spots/:id 401', async () => {
  const { status } = await request(app()).put(`/${spot.id}`);
  expect(status).toBe(401);
});

test('PUT /spots/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({
      access_token: anotherSession,
      location: [-73.856077, 40.848447],
      photo: 'test'
    });
  expect(status).toBe(404);
});

test('DELETE /spots/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${spot.id}`)
    .query({ access_token: userSession });
  expect(status).toBe(204);
});

test('DELETE /spots/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${spot.id}`)
    .send({ access_token: anotherSession });
  expect(status).toBe(401);
});

test('DELETE /spots/:id 401', async () => {
  const { status } = await request(app()).delete(`/${spot.id}`);
  expect(status).toBe(401);
});

test('DELETE /spots/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession });
  expect(status).toBe(404);
});
