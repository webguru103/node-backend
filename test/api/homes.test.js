const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');
const { User, Keycode, Home, KeycodeBatch, Builder, Community } = require('../../app/models');

const factory = require('../factories');
const { clean } = require('../test_utils');

const expectedHomeAttributes = [
  'id', 'address1', 'address2', 'city', 'state', 'zipCode', 'communityId',
  'builderId', 'homeType', 'keycodeId', 'fullAddress', 'baths', 'beds',
  'floorPlanUrl', 'garages', 'imageUrl', 'lot', 'lotPlanUrl', 'lotSize',
  'modelName', 'parcelNumber', 'squareFeet', 'yearBuilt',
]
const expectedCommunityAttributes = [
  'id', 'name', 'crossStreets', 'city', 'state', 'zipCode'
]
const expectedBuilderAttributes = [
  'id', 'companyName', 'companyPhone', 'mainContactName', 'mainContactEmail', 'mainContactPhone', 'address1',
  'address2', 'city', 'state', 'zipCode'
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

  describe('GET /homes', async () => {
    test('returns a list of homes, limit 10 in descending order by default', async (done) => {
      const secondPageHome = await factory.create('Home')
      const homes = await factory.createMany('Home', 10)
      homes.forEach(async home => {
        const builder = await factory.create('Builder')
        await home.setBuilder(builder) 
        const community = await factory.create('Community')
        await home.setCommunity(community) 
      })

      request(app)
        .get('/homes')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, homes } = response.body

          const expectedHomes = homes.map(home => R.pickAll(expectedHomeAttributes, home.home))
          const expectedBuilders = homes.map(home => R.pickAll(expectedBuilderAttributes, home.builder))
          const expectedCommunities = homes.map(home => R.pickAll(expectedCommunityAttributes, home.community))

          expect(count).toEqual(11)
          expect(homes).toHaveLength(10)
          expect(homes.map(home => home.home)).toEqual(expectedHomes)
          expect(homes.map(home => home.builder)).toEqual(expectedBuilders)
          expect(homes.map(home => home.community)).toEqual(expectedCommunities)
          expect(moment(homes[0].createdAt).diff(homes[1].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(homes[1].createdAt).diff(homes[2].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(homes[2].createdAt).diff(homes[3].createdAt)).toBeLessThanOrEqual(0)
          expect(homes[2].builder).toBeTruthy()
          expect(homes).not.toContainEqual(secondPageHome)
          done()
        })
    })

    test('pagination works', async (done) => {
      await Home.truncate({cascade: true})
      const _ = await factory.createMany('Home', 8)

      request(app)
        .get('/homes?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { homes: homes1 } = response.body
          expect(homes1).toHaveLength(5)
          request(app)
            .get('/homes?page=2&per=5')
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
      await Keycode.truncate({cascade: true})
      await Home.truncate({cascade: true})
      await Builder.truncate({cascade: true})
      await Community.truncate({cascade: true})

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
        .get('/homes')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.statusCode).toBe(200);
          const { count: count1, homes: homes1 } = response.body
          expect(count1).toEqual(3)
          expect(homes1).toHaveLength(3)
          expect(homes1.map(home => home.home.id)).toEqual([home3.id, home2.id, home1.id])

          // builderId sort DESC
          request(app)
            .get('/homes?sort=builder:desc')
            .set('Authorization', token)
            .end((err, response) => {
              expect(response.statusCode).toBe(200);
              const { count: count2, homes: homes2 } = response.body
              console.warn("Homes:", homes2)
              expect(count2).toEqual(3)
              expect(homes2).toHaveLength(3)
              expect(homes2.map(home => home.builder.companyName)).toEqual(['Octan Corp.', 'Def Jam Records', 'Acme Corp.'])

              // state sort DESC
              request(app)
                .get('/homes?sort=state:desc')
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

  describe('GET /homes/1', () => {

    test('gets a single home', async (done) => {
      const _homes1 = await factory.createMany('Home', 2)
      const _home = await factory.create('Home')
      const _homes2 = await factory.createMany('Home', 3)

      request(app).get(`/homes/${_home.id}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { home } = response.body
          expect(home).toEqual(R.pickAll(expectedHomeAttributes, _home))
          done()
        })
    })

    test('returns a 404 if not found', async (done) => {
      request(app)
        .get('/homes/0')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { home } = response.body
          expect(home).toBeNull()
          expect(response.status).toBe(404)
          done()
        })
    })
  })

  describe('PUT /homes/1', () => {
    test('successfully updates a home', async (done) => {
      const _keycode = await factory.create('Keycode')
      const _home = await factory.create('Home', {
        address1: "123 My st.", zipCode: "12345", address2: null, state: "NY", keycodeId: _keycode.id
      })

      request(app)
        .put(`/homes/${_home.id}`)
        .set('Authorization', token)
        .send({ 
          home: {
            address1: "321 Your St.",
            address2: "Apt. G",
            keycodeId: null,
            zipCode: "54321-1234"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { home } = response.body
          expect(home.address1).toBe("321 Your St.")
          expect(home.address2).toBe("Apt. G")
          expect(home.keycodeId).toBe(null)
          expect(home.zipCode).toBe("54321-1234")
          expect(home.state).toBe("NY")

          done()
        })
    })

    test('failure to update a home gives a 422', async (done) => {
      const _home = await factory.create('Home')

      request(app)
        .put(`/homes/${_home.id}`).send({ 
          home: {
            address1: null,
            zipCode: "abcd-123"
          }
        })
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain("Home.address1 cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          done()
        })
    })
  })

  describe('POST /homes - multiple', () => {
    test('returns the home that was just created', async (done) => {
      const _community = await factory.create('Community')
      const _builder = await factory.create('Builder')
      request(app)
        .post('/homes')
        .set('Authorization', token)
        .send({
          homes: [{
            address1: "1 1st st.",
            address2: "",
            city: "Onesville",
            state: "DE",
            zipCode: "11111-1111",
            communityId: _community.id,
            builderId: _builder.id,
            homeType: "single_family"
          },
          {
            address1: "2 2nd st.",
            address2: "Suite 2",
            city: "Twosberg",
            state: "PA",
            zipCode: "22222-2222",
            communityId: _community.id,
            builderId: _builder.id,
            homeType: "duplex",
          }]
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(201);
          const { homes } = response.body;
          const [home1,home2] = homes

          expect(home1.address1).toBe("1 1st st.")
          expect(home1.address2).toBe("")
          expect(home1.city).toBe("Onesville")
          expect(home1.state).toBe("DE")
          expect(home1.communityId).toBe(_community.id)
          expect(home1.builderId).toBe(_builder.id)
          expect(home1.zipCode).toBe("11111-1111")
          expect(home1.homeType).toBe("single_family")

          expect(home2.address1).toBe("2 2nd st.")
          expect(home2.address2).toBe("Suite 2")
          expect(home2.city).toBe("Twosberg")
          expect(home2.state).toBe("PA")
          expect(home2.communityId).toBe(_community.id)
          expect(home2.builderId).toBe(_builder.id)
          expect(home2.zipCode).toBe("22222-2222")
          expect(home2.homeType).toBe("duplex")
          done()
        })
    })

    test('returns the home that was just created', async (done) => {
      const _community = await factory.create('Community')
      const _builder = await factory.create('Builder')
      request(app)
        .post('/homes')
        .set('Authorization', token)
        .send({
          homes: [{
            address1: "1 1st st.",
            address2: "",
            city: "Onesville",
            state: null,
            zipCode: "11111-1111",
            communityId: _community.id,
            builderId: _builder.id,
            homeType: "single_family"
          },
          {
            address1: "2 2nd st.",
            address2: "Suite 2",
            city: null,
            state: "PA",
            zipCode: "22222-2222",
            communityId: _community.id,
            builderId: _builder.id,
            homeType: "duplex",
          }]
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { homes } = response.body;
          const [home1,home2] = homes

          expect(home1.errors).toEqual(['Home.state cannot be null'])

          expect(home2.errors).toEqual(['Home.city cannot be null'])
          done()
        })
    })
  })

  describe('POST /homes - single', () => {
    test('returns the home that was just created', async (done) => {
      const _community = await factory.create('Community')
      const _builder = await factory.create('Builder')
      request(app)
        .post('/homes')
        .set('Authorization', token)
        .send({
          home: {
            address1: "234 My Street",
            address2: "",
            city: "Anytown",
            state: "AZ",
            zipCode: "12345-1234",
            communityId: _community.id,
            builderId: _builder.id,
            homeType: "single_family"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(201);
          const { home } = response.body;
          expect(home.address1).toBe("234 My Street")
          expect(home.address2).toBe("")
          expect(home.city).toBe("Anytown")
          expect(home.state).toBe("AZ")
          expect(home.communityId).toBe(_community.id)
          expect(home.builderId).toBe(_builder.id)
          expect(home.zipCode).toBe("12345-1234")
          expect(home.homeType).toBe("single_family")
          done()
        })
    });

    test('It returns any validation errors', async (done) => {
      request(app)
        .post('/homes')
        .set('Authorization', token)
        .send({
          "home": {
            "address1": null, // can't be null
            "address2": "",
            "city": null, // can't be null
            "state": "ZZ", // not a real state
            "zipCode": "12345-", // not a valid zip code
            "communityId": null, // can't be null
            "builderId": null, // can't be null
            "homeType": "shack" // not one of the choices
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain("Home.builderId cannot be null")
          expect(errors).toContain("Home.communityId cannot be null")
          expect(errors).toContain("Home.city cannot be null")
          expect(errors).toContain("Home.address1 cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          expect(errors).toContain("Validation isIn on state failed")
          expect(errors).toContain("Validation isIn on homeType failed")
          done()
        })
    });
  });
});
