const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');

const { User, Keycode, KeycodeBatch } = require('../../app/models');
const { clean } = require('../test_utils');

const factory = require('../factories');

const expectedAttributes = [
  'id', 'uid', 'keycodeBatchId', 'pngLocation', 'svgLocation', 'status', 'assignedAt', 'readyToShipAt', 'installedAt', 'activatedAt', 'unassignedAt'
]

// TODO - Test filtering through GET /keycodes?status=unassigned,blank

describe("keycodes", () => {
  let token
  beforeAll(async (done) => {
    await clean()
    const encryptedPassword = await bcrypt.hash("S3kr1t123", 10);
    const user = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      encryptedPassword,
    });
    token = 'Bearer ' + jwt.encode({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    done()
  })

  describe('GET /keycodes', () => {
    test('returns a list of keycodes, limit 10 in descending order', async (done) => {
      const secondPageKeycode = await factory.create('Keycode')
      const _ = await factory.createMany('Keycode', 10)

      request(app)
        .get('/keycodes')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, keycodes } = response.body

          const expectedKeycodes = keycodes.map(keycode => Object.assign(
            {}, R.pickAll(expectedAttributes, keycode), {totalScans: 0}
          ))

          expect(count).toEqual(11)
          expect(keycodes).toHaveLength(10)
          expect(keycodes).toEqual(expectedKeycodes)
          expect(moment(keycodes[0].createdAt).diff(keycodes[1].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(keycodes[1].createdAt).diff(keycodes[2].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(keycodes[2].createdAt).diff(keycodes[3].createdAt)).toBeLessThanOrEqual(0)
          expect(keycodes).not.toContainEqual(secondPageKeycode)
          done()
        })
    })
  })

  describe('POST /keycodes', async () => {
    test('returns the created keycodes', async (done) => {
      request(app)
        .post('/keycodes')
        .set('Authorization', token)
        .send({ keycodes: {howMany: 1} })
        .end(async (err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(201);
          const { keycodes, keycodeBatch } = response.body;
          const keycode = keycodes[0]

          const __keycodes = await Keycode.findAll()

          expect(keycode.uid).toMatch(/\d{10}/)
          expect(keycodeBatch.batchNumber).toMatch(/\d{6}\-\d{2,}/)
          expect(keycode.svgLocation).toBe(null)
          expect(keycode.pngLocation).toBe(null)
          expect(keycode.status).toBe("blank")
          expect(keycode.assignedAt).toBe(null)
          expect(keycode.installedAt).toBe(null)
          expect(keycode.activatedAt).toBe(null)
          expect(keycode.readyToShipAt).toBe(null)
          done()
        })
    });
  })

  describe('PUT /keycodes/100000000001', () => {
    test('sets the assignedAt field if status is set to assigned', async (done) => {
      const _keycode = await factory.create('Keycode')
      request(app)
        .put(`/keycodes/${_keycode.uid}`)
        .set('Authorization', token)
        .send({ keycode: { status: "assigned" } })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(200);

          const { keycode } = response.body
          expect(keycode.status).toBe('assigned')
          expect(keycode.assignedAt).toMatch(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/)
          done()
        })
    })

    test('sets the installedAt field if status is set to installed', async () => {
      const _keycode = await factory.create('Keycode')
      const response = await request(app)
              .put(`/keycodes/${_keycode.uid}`)
              .set('Authorization', token)
              .send({ keycode: { status: "installed" } })
      expect(response.statusCode).toBe(200);

      const { keycode } = response.body
      expect(keycode.status).toBe('installed')
      expect(keycode.installedAt).toMatch(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/)
    })

    test('sets the readyToShipAt field if status is set to ready_to_ship', async (done) => {
      const _keycode = await factory.create('Keycode')
      request(app)
        .put(`/keycodes/${_keycode.uid}`)
        .set('Authorization', token)
        .send({ keycode: { status: "ready_to_ship" } })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(200);

          const { keycode } = response.body
          expect(keycode.status).toBe('ready_to_ship')
          expect(keycode.readyToShipAt).toMatch(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/)
          done()
        })
    })

    test('sets the activatedAt field if status is set to activated', async () => {
      const _keycode = await factory.create('Keycode')
      const response = await request(app)
              .put(`/keycodes/${_keycode.uid}`)
              .set('Authorization', token)
              .send({ keycode: { status: "activated" } })
      expect(response.statusCode).toBe(200);

      const { keycode } = response.body
      expect(keycode.status).toBe('activated')
      expect(keycode.activatedAt).toMatch(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/)
    })

    test('sets the unassignedAt field if status is set to unassigned', async (done) => {
      const _keycode = await factory.create('Keycode', { status: 'blank' })
      request(app)
        .put(`/keycodes/${_keycode.uid}`)
        .set('Authorization', token)
        .send({ keycode: { status: "unassigned" } })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(200);

          const { keycode } = response.body
          expect(keycode.status).toBe('unassigned')
          expect(keycode.unassignedAt).toMatch(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/)
          done()
        })
    })
  })

  describe('GET /keycodes/100000000001', () => {
    test('returns the keycode, by uid, if it exists', async (done) => {
      const _keycode = await factory.create('Keycode')

      request(app)
        .get(`/keycodes/${_keycode.uid}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { keycode } = response.body;

          expect(keycode.uid).toMatch(/\d{10}/)
          expect(keycode.uid).toEqual(_keycode.uid)
          done()
        })
    })

    test('if attached to a home, returns the home too', async (done) => {
      const _keycode = await factory.create('Keycode')
      const _home = await factory.create('Home', {keycodeId: _keycode.id})

      request(app)
        .get(`/keycodes/${_keycode.uid}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { keycode, home } = response.body;

          expect(keycode.uid).toMatch(/\d{10}/)
          expect(keycode.uid).toEqual(_keycode.uid)
          expect(home.id).toEqual(_home.id)
          done()
        })
    })

    test('returns null if the keycode does not exist', async (done) => {
      request(app)
        .get('/keycodes/0')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) return fail(err)
          const { keycode, home } = response.body;

          expect(keycode).toBe(null)
          expect(home).toBe(null)
          done()
        })
    })
  })
})
