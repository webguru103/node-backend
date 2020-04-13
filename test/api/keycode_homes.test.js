const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');

const { clean } = require('../test_utils');
const { User, Keycode, Home, KeycodeBatch, Builder, Community } = require('../../app/models');

const factory = require('../factories');

describe('keycode homes', () => {
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

  describe('GET /keycode_homes', () => {
    test('returns a list of keycode_homes, limit 10 in descending order', async (done) => {
      const homes = await factory.createMany('HomeWithKeycode', 11)
      const lastHomeCreated = homes[10]

      request(app)
        .get('/keycode_homes?page=1')
        .set('Authorization', token)
        .end((err, response) => {
          console.warn("ERR:", err)
          expect(response.statusCode).toBe(200);
          const { count, keycodeHomes } = response.body
          expect(count).toEqual(11)
          expect(keycodeHomes).toHaveLength(10)
          const { home: firstHomeReturned, keycode: firstKeycodeReturned } = keycodeHomes[0]
          expect(firstHomeReturned.id).toEqual(lastHomeCreated.id)
          expect(firstKeycodeReturned.id).toEqual(lastHomeCreated.keycodeId)
          done()
        })
    })

    test('returns a sorted list by builder, state, and status', async (done) => {
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})
      await Builder.truncate({cascade: true})

      const keycode1 = await factory.create('Keycode', { status: 'unassigned'})
      const builder1 = await factory.create('Builder', { companyName: "Def Jam Records"})
      const home1 = await factory.create('Home', { keycodeId: keycode1.id, builderId: builder1.id, state: 'WY'})

      const keycode2 = await factory.create('Keycode', { status: 'assigned'})
      const builder2 = await factory.create('Builder', { companyName: "Octan Corp."})
      const home2 = await factory.create('Home', { keycodeId: keycode2.id, builderId: builder2.id, state: 'AZ'})

      const keycode3 = await factory.create('Keycode', { status: 'installed'})
      const builder3 = await factory.create('Builder', { companyName: "Acme Corp."})
      const home3 = await factory.create('Home', { keycodeId: keycode3.id, builderId: builder3.id, state:  'KY'})

      // Default sort id DESC
      request(app)
        .get('/keycode_homes')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.statusCode).toBe(200);
          const { count: count1, keycodeHomes: keycodeHomes1 } = response.body
          expect(count1).toEqual(3)
          expect(keycodeHomes1).toHaveLength(3)
          expect(keycodeHomes1.map(kh => kh.home.id)).toEqual([home3.id, home2.id, home1.id])

          // builderId sort DESC
          request(app)
            .get('/keycode_homes?sort=builder:desc')
            .set('Authorization', token)
            .end((err, response) => {
              expect(response.statusCode).toBe(200);
              const { count: count2, keycodeHomes: keycodeHomes2 } = response.body
              expect(count2).toEqual(3)
              expect(keycodeHomes2).toHaveLength(3)
              expect(keycodeHomes2.map(kh => kh.builder.companyName)).toEqual(['Octan Corp.', 'Def Jam Records', 'Acme Corp.'])

              // status sort ASC
              request(app)
                .get('/keycode_homes?sort=status:asc')
                .set('Authorization', token)
                .end((err, response) => {
                  expect(response.statusCode).toBe(200);
                  const { count: count3, keycodeHomes: keycodeHomes3 } = response.body
                  expect(count3).toEqual(3)
                  expect(keycodeHomes3).toHaveLength(3)
                  expect(keycodeHomes3.map(kh => kh.keycode.status)).toEqual(['assigned', 'installed', 'unassigned'])

                  // state sort DESC
                  request(app)
                    .get('/keycode_homes?sort=state:desc')
                    .set('Authorization', token)
                    .end((err, response) => {
                      expect(response.statusCode).toBe(200);
                      const { count: count4, keycodeHomes: keycodeHomes4 } = response.body
                      expect(count4).toEqual(3)
                      expect(keycodeHomes4).toHaveLength(3)
                      expect(keycodeHomes4.map(kh => kh.home.state)).toEqual(['WY', 'KY', 'AZ'])
                      done()
                    })
                })
            })
        })
    })
  })
})
