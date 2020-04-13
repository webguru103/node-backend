const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');
const { User, Keycode, Home, KeycodeBatch, Builder, Community } = require('../../app/models');

const factory = require('../factories');
const { clean } = require('../test_utils');

const expectedAttributes = [
  'id', 'address1', 'address2', 'city', 'state', 'zipCode', 'communityId', 'builderId', 'homeType', 'keycodeId', 'fullAddress', 'builder'
]

describe("homes", () => {
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

  describe('GET /queued_homes', async () => {
    test('returns a list of homes, limit 10 in descending order by default', async (done) => {
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})
      await Builder.truncate({cascade: true})

      const secondPageHome = await factory.create('Home')
      const homes = await factory.createMany('Home', 10)
      homes.forEach(async home => {
        const builder = await factory.create('Builder')
        await home.setBuilder(builder) 
      })

      request(app)
        .get('/queued_homes')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, homes: _homes } = response.body

          expect(count).toEqual(11)
          expect(_homes).toHaveLength(10)
          expect(_homes[2].builder).toBeTruthy()
          expect(_homes).not.toContainEqual(secondPageHome)
          done()
        })
    })

    test('pagination works', async (done) => {
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})
      await Builder.truncate({cascade: true})

      const _ = await factory.createMany('Home', 8)

      request(app)
        .get('/queued_homes?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { homes: homes1 } = response.body
          expect(homes1).toHaveLength(5)
          request(app)
            .get('/queued_homes?page=2&per=5')
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { homes: homes2 } = response.body
              expect(homes2).toHaveLength(3)
              done()
            })
        })
    })

    test('returns a sorted list by builder, state, and status', async (done) => {
      await Home.truncate({cascade: true})
      await Builder.truncate({cascade: true})

      const builder1 = await factory.create('Builder', { companyName: "Def Jam Records"})
      const home1 = await factory.create('Home', { builderId: builder1.id, state: 'WY'})

      const builder2 = await factory.create('Builder', { companyName: "Octan Corp."})
      const home2 = await factory.create('Home', { builderId: builder2.id, state: 'AZ'})

      const builder3 = await factory.create('Builder', { companyName: "Acme Corp."})
      const home3 = await factory.create('Home', { builderId: builder3.id, state:  'KY'})

      // Default sort id DESC
      request(app)
        .get('/queued_homes')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.statusCode).toBe(200);
          const { count: count1, homes: homes1 } = response.body
          expect(count1).toEqual(3)
          expect(homes1).toHaveLength(3)
          expect(homes1.map(home => home.home.id)).toEqual([home3.id, home2.id, home1.id])

          // builderId sort DESC
          request(app)
            .get('/queued_homes?sort=builder:desc')
            .set('Authorization', token)
            .end((err, response) => {
              expect(response.statusCode).toBe(200);
              const { count: count2, homes: homes2 } = response.body
              expect(count2).toEqual(3)
              expect(homes2).toHaveLength(3)
              expect(homes2.map(home => home.builder.companyName)).toEqual(['Octan Corp.', 'Def Jam Records', 'Acme Corp.'])

              // state sort DESC
              request(app)
                .get('/queued_homes?sort=state:desc')
                .set('Authorization', token)
                .end((err, response) => {
                  expect(response.statusCode).toBe(200);
                  const { count: count3, homes: homes3 } = response.body
                  expect(count3).toEqual(3)
                  expect(homes3).toHaveLength(3)
                  expect(homes3.map(home => home.home.state)).toEqual(['WY', 'KY', 'AZ'])
                  done()
                })
            })
        })
    })
  })
})