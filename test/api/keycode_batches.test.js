const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');

const { User } = require('../../app/models');

const { clean } = require('../test_utils');
const factory = require('../factories');

describe('keycode batches', () => {
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

  describe('GET /keycode_batches/123/status', () => {
    test('returns the status of an incomplete batch', async (done) => {
      const _keycodeBatch = await factory.create('KeycodeBatch')
      const { id } = _keycodeBatch
      const unassigned_1 = await factory.create('Keycode', { keycodeBatchId: id, status: 'unassigned' })
      const unassigned_2 = await factory.create('Keycode', { keycodeBatchId: id, status: 'unassigned' })
      const unassigned_3 = await factory.create('Keycode', { keycodeBatchId: id, status: 'unassigned' })
      const blank_1 = await factory.create('Keycode', { keycodeBatchId: id, status: 'blank' })
      const blank_2 = await factory.create('Keycode', { keycodeBatchId: id, status: 'blank' })

      request(app)
        .get(`/keycode_batches/${id}/status`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { keycodeBatch } = response.body

          expect(keycodeBatch.id).toEqual(id)
          expect(keycodeBatch.blankKeycodesCount).toEqual(2)
          expect(keycodeBatch.allKeycodesCount).toEqual(5)
          expect(keycodeBatch.batchNumber).not.toBe(null)
          expect(keycodeBatch.status).toEqual('generation_in_progress')
          done()
        })
    })

    test('returns the status of a complete batch', async (done) => {
      const _keycodeBatch = await factory.create('KeycodeBatch')
      const unassigned_1 = await factory.create('Keycode', { keycodeBatchId: _keycodeBatch.id, status: 'unassigned' })
      const unassigned_2 = await factory.create('Keycode', { keycodeBatchId: _keycodeBatch.id, status: 'unassigned' })
      const unassigned_3 = await factory.create('Keycode', { keycodeBatchId: _keycodeBatch.id, status: 'unassigned' })

      request(app)
        .get(`/keycode_batches/${_keycodeBatch.id}/status`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { keycodeBatch } = response.body

          expect(keycodeBatch.id).toEqual(_keycodeBatch.id)
          expect(keycodeBatch.blankKeycodesCount).toEqual(0)
          expect(keycodeBatch.allKeycodesCount).toEqual(3)
          expect(keycodeBatch.batchNumber).not.toBe(null)
          expect(keycodeBatch.status).toEqual('generation_complete')
          done()
        })
    })
  })
})
