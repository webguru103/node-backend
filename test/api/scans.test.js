const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');

const { User, Device, Scan, Keycode, Home } = require('../../app/models');
const { clean } = require('../test_utils');

const factory = require('../factories');

let token;
let user;

describe('keycode scans', () => {
  let token
  beforeAll(async (done) => {
    await clean()
    const encryptedPassword = await bcrypt.hash("S3kr1t123", 10);
    user = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      encryptedPassword,
    });
    token = 'Bearer ' + jwt.encode({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    done()
  })

  describe("POST /keycodes/:uid/scans/admin", async () => {
    test('It returns the scan, and a previously registered device', async (done) => {
      const device = await factory.create('Device', {
        appVersion: '1.2.3',
        appType: 'admin',
        deviceOS: 'Android 8.0',
        deviceType: 'Nexus One',
        userId: user.id,
      })
      const storedKeycode = await factory.create('Keycode')

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.3',
            appType: 'admin',
            deviceOS: 'Android 8.0',
            deviceType: 'Nexus One',
            userId: user.id,
            uid: storedKeycode.uid,
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { scan: _scan, device: _device, _home, _keycode } = response.body

          expect(response.statusCode).toBe(201);
          expect(_scan).toBeTruthy()
          expect(_device).toBeTruthy()
          expect(_device.id).toEqual(device.id)
          done()
        })
    });

    test('It returns the scan, and a newly registered device', async (done) => {
      await Device.truncate({cascade: true})
      const similarDevice = factory.create('Device', {
        appVersion: '1.2.3',
        appType: 'admin',
        deviceOS: 'Android 8.0',
        deviceType: 'Nexus One',
        userId: user.id,
      })
      const storedKeycode = await factory.create('Keycode', {uid: '123123123123'})

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.3',
            appType: 'admin',
            deviceOS: 'iOS 12.1',
            deviceType: 'iPhone XR',
            assign: false,
            uid: storedKeycode.uid
          }
        })
        .end(async (err, response) => {
          if (err) fail(err)

          const { scan, device, _home, _keycode } = response.body

          const deviceCount = await Device.count()
          expect(response.statusCode).toBe(201);
          expect(scan).toBeTruthy()
          expect(device).toBeTruthy()
          expect(deviceCount).toEqual(2)
          done()
        })
    });

    test('It returns the scan, device, and a keycode if found but unassigned', async (done) => {
      const storedKeycode = await factory.create('Keycode')

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: false,
            uid: storedKeycode.uid,
          }
        })
        .end((err, response) => {
          if (err) fail(err)

          const { scan, device, keycode, home } = response.body

          expect(response.statusCode).toBe(201);
          expect(scan).toBeTruthy()
          expect(device).toBeTruthy()
          expect(keycode).toBeTruthy()
          expect(home).toBeNull()
          expect(keycode.id).toEqual(storedKeycode.id)
          done()
        })
    });

    test('It returns the scan, device, and no keycode if not found', async (done) => {
      const _ = factory.create('Keycode')

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: false,
            uid: "0"
          }
        })
        .end((err, response) => {
          if (err) fail(err)

          const { scan, device, keycode, home, result } = response.body

          expect(result).toEqual({ status: "error", code: "keycode_not_found" })
          expect(response.statusCode).toBe(201);
          expect(scan).toBeTruthy()
          expect(device).toBeTruthy()
          expect(home).toBeNull()
          expect(keycode).toBeNull()
          done()
        })
    });

    test('It returns the scan and assigns a keycode if requested', async (done) => {
      const _keycode = await factory.create('Keycode')
      const _home = await factory.create('Home')

      expect(_home.keycodeId).toBeNull()

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: true,
            uid: _keycode.uid
          }
        })
        .end(async (err, response) => {
          if (err) fail(err)
          const { scan, home, keycode } = response.body
          expect(scan).toBeTruthy()
          expect(home).toBeTruthy()
          expect(keycode).toBeTruthy()
          expect(home.keycodeId).toEqual(keycode.id)

          const _keycode2 = await Keycode.findById(keycode.id)

          expect(_keycode2.assignedAt).toBeTruthy()

          done()
        })
    });

    test('It returns the home if already assigned to the keycode', async (done) => {
      const _keycode = await factory.create('Keycode')
      const _home = await factory.create('Home', {keycodeId: _keycode.id})

      expect(_home.keycodeId).toBeTruthy()

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: true,
            uid: _keycode.uid
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { scan, home, keycode } = response.body
          expect(scan).toBeTruthy()
          expect(home).toBeTruthy()
          expect(keycode).toBeTruthy()
          expect(home.keycodeId).toEqual(keycode.id)
          done()
        })
    });

    test('It returns an error if no homes are available in the queue', async (done) => {
        await Keycode.truncate({cascade: true})
        await Home.truncate({cascade: true})
        const _keycode = await factory.create('Keycode')
        const _home = await factory.create('Home', {keycodeId: _keycode.id})
        const _keycode2 = await factory.create('Keycode')

        const keycodeCount1 = await Keycode.count()

        expect(keycodeCount1).toEqual(2)

        expect(_home.keycodeId).toBeTruthy()

        request(app)
          .post('/keycodes/scans/admin')
          .set('Authorization', token)
          .send({
            scan: {
              appVersion: '1.2.4',
              appType: 'admin',
              deviceOS: 'Android 7.0',
              deviceType: 'iOS 12.1',
              assign: true,
              uid: _keycode2.uid
            }
          })
          .end((err, response) => {
            if (err) fail(err)
            expect(response.body.result).toEqual({ status: "error", code: "no_homes_available" })
            done()
          })
    });

    test('When assigning, it sets assignedAt and the status to assigned for that keycode', async (done) => {
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})

      const _keycode = await factory.create('Keycode', { status: 'unassigned', assignedAt: null })
      const _home = await factory.create('Home')

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: true,
            uid: _keycode.uid
          }
        })
        .end(async (err, response) => {
          if (err) fail(err)

          const _keycode2 = await Keycode.findById(_keycode.id)
          const _home2 = await Home.findById(_home.id)

          expect(_keycode2.status).toEqual('assigned')
          expect(_keycode2.assignedAt).toBeTruthy()
          expect(_home2.keycodeId).toEqual(_keycode2.id)

          done()
        })
  })

    test('When assigning, it returns an error if no keycode exists with that uid', async (done) => {
      await Keycode.truncate({cascade: true})

      request(app)
        .post('/keycodes/scans/admin')
        .set('Authorization', token)
        .send({
          scan: {
            appVersion: '1.2.4',
            appType: 'admin',
            deviceOS: 'Android 7.0',
            deviceType: 'iOS 12.1',
            assign: true,
            uid: '0',
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.body.result).toEqual({ status: "error", code: "keycode_not_found" })
          done()
        })
    })
  })

  describe("GET /keycodes/scans/admin", () => {
    test('it gets a paginated list of all scans', async (done) => {
      await Scan.truncate({cascade: true})
      await factory.createMany('Scan', 8)

      request(app)
        .get('/keycodes/scans/admin?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { scans: scans1 } = response.body
          expect(response.statusCode).toBe(200);
          expect(scans1).toHaveLength(5)

          request(app)
            .get('/keycodes/scans/admin?page=2&per=5')
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { scans: scans2 } = response.body

              expect(scans2).toHaveLength(3)
              expect(Object.keys(scans2[0])).toEqual(['scan','device'])

              done()
            })
        })
    })
  })

  describe("GET /keycodes/:uid/scans/admin", () => {
    test('it gets a paginated list of scans for one keycode', async (done) => {
      await Scan.truncate({cascade: true})
      await Keycode.truncate({cascade: true})
      const keycode = await factory.create('Keycode')
      const device = await factory.create('Device')
      const _otherKeycode = await factory.create('Keycode')
      const _otherDevice = await factory.create('Device')
      const _scans = await factory.createMany('Scan', 8, {
        keycodeId: keycode.id,
        deviceId: device.id
      })
      const _otherScan = await factory.create('Scan', {
        keycodeId: _otherKeycode.id,
        deviceId: _otherDevice.id
      })

      request(app)
        .get(`/keycodes/${keycode.uid}/scans/admin?page=1&per=5`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { scans: scans1 } = response.body

          expect(scans1).toHaveLength(5)
          expect(scans1.map(scan => scan.scan.keycodeId).includes(_otherScan.keycodeId)).toBeFalsy()

          request(app)
            .get(`/keycodes/${keycode.uid}/scans/admin?page=2&per=5`)
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { scans: scans2 } = response.body

              expect(scans2).toHaveLength(3)
              expect(scans2.map(scan => scan.scan.keycodeId).includes(_otherScan.keycodeId)).toBeFalsy()
              expect(Object.keys(scans2[0])).toEqual(['scan','device'])

              done()
            })
        })
    })
  })
})
