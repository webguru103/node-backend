const request = require('supertest');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jwt-simple');
const tk = require('timekeeper')

const app = require('../../app');

const { User, Keycode, Home, Scan } = require('../../app/models');
const { clean } = require('../test_utils');

const factory = require('../factories');

describe("statistics", () => {
  let token
  beforeAll(async () => {
    await clean()
    const encryptedPassword = await bcrypt.hash("S3kr1t123", 10);
    const user = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      encryptedPassword,
    });
    token = 'Bearer ' + jwt.encode({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  })

  beforeEach(async () => {
    tk.reset()
  })

  describe("GET /statistics", () => {
    test('shows the month-to-date total, month-over-month increase, and YTD scans for the app', async (done) => {
      await Scan.truncate({cascade: true})
      const nye = '2000-12-31'
      tk.travel(moment(nye).toDate())
      const _scans1 = factory.createMany('Scan', 10, { createdAt: moment(nye).subtract(1, 'year')}); // December 31, 1999
      const _scans2 = factory.createMany('Scan', 2, { createdAt: moment(nye).subtract(2, 'months')}); // October 31, 2000
      const _scans3 = factory.createMany('Scan', 3, { createdAt: moment(nye).subtract(1, 'months')}); // November 30, 2000
      const _scans4 = factory.createMany('Scan', 2, { createdAt: moment(nye).subtract(2, 'weeks')}); // December 17, 2000
      const _scans5 = factory.createMany('Scan', 9, { createdAt: moment(nye).subtract(1, 'week')}); // December 24, 2000

      request(app)
        .get('/statistics')
        .set('Authorization', token)
        .end(async (err, response) => {
          if (err) fail(err)

          const { statistics } = response.body

          expect(response.statusCode).toBe(200);
          expect(statistics.monthToDateScanCount).toEqual(11)
          expect(statistics.monthOverMonthScanIncrease).toEqual(0.5)
          expect(statistics.yearToDateScanCount).toEqual(16)
          done()
        })
    })

    test('shows the unassigned keycodes and homes that need keycodes', async (done) => {
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})
      const _unassignedKeycodes = await factory.createMany('Keycode', 14, { status: 'unassigned' })
      const _unassignedHomes = await factory.createMany('Home', 24, { keycodeId: null })
      const keycode = await factory.create('Keycode', { status: 'ready_to_ship' })
      const _assignedHome = await factory.create('Home', { keycodeId: keycode.id })

      request(app)
        .get('/statistics')
        .set('Authorization', token)
        .end(async (err, response) => {
          if (err) fail(err)

          const { statistics } = response.body

          expect(response.statusCode).toBe(200);
          expect(statistics.unassignedHomeCount).toEqual(24)
          expect(statistics.unassignedKeycodeCount).toEqual(14)
          done()
        })
    })

    test('shows the activated and installed keycodes', async (done) => {
      await Scan.truncate({cascade: true})
      const _installedKeycodes = factory.createMany('Keycode', 26, { status: 'installed' })
      const _activatedKeycodes = factory.createMany('Keycode', 33, { status: 'activated' })

      request(app)
        .get('/statistics')
        .set('Authorization', token)
        .end(async (err, response) => {
          if (err) fail(err)

          const { statistics } = response.body

          expect(response.statusCode).toBe(200);
          expect(statistics.installedKeycodeCount).toEqual(26)
          expect(statistics.activatedKeycodeCount).toEqual(33)
          done()
        })
    })
  })
})
