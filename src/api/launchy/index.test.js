import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Launchy } from '.'

const app = () => express(routes)

let userSession, anotherSession, launchy

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  launchy = await Launchy.create({ user })
})

test('POST /launchies 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, monitor: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.monitor).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /launchies 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /launchies 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /launchies 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /launchies/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${launchy.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(launchy.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /launchies/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${launchy.id}`)
  expect(status).toBe(401)
})

test('GET /launchies/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /launchies/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${launchy.id}`)
    .send({ access_token: userSession, monitor: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(launchy.id)
  expect(body.monitor).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /launchies/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${launchy.id}`)
    .send({ access_token: anotherSession, monitor: 'test' })
  expect(status).toBe(401)
})

test('PUT /launchies/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${launchy.id}`)
  expect(status).toBe(401)
})

test('PUT /launchies/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, monitor: 'test' })
  expect(status).toBe(404)
})

test('DELETE /launchies/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${launchy.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /launchies/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${launchy.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /launchies/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${launchy.id}`)
  expect(status).toBe(401)
})

test('DELETE /launchies/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
