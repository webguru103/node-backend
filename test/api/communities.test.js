const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');
const { User, Community } = require('../../app/models');

const factory = require('../factories');
const { clean } = require('../test_utils');

describe('communities', () => {

  const expectedAttributes = [
    'id', 'name', 'crossStreets', 'city', 'state', 'zipCode'
  ]

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

  describe('GET /communities', async () => {
    test('returns a list of communities, limit 10 in descending order by default', async (done) => {
      const secondPageCommunity = await factory.create('Community')
      const _ = await factory.createMany('Community', 10)

      request(app)
        .get('/communities')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, communities } = response.body

          const expectedCommunities = communities.map(community => Object.assign({},
            R.pickAll(expectedAttributes, community),
            { homesCount: 0, activatedHomes: 0, builders: [] })
          )

          expect(count).toEqual(11)
          expect(communities).toHaveLength(10)
          expect(communities).toEqual(expectedCommunities)
          expect(moment(communities[0].createdAt).diff(communities[1].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(communities[1].createdAt).diff(communities[2].createdAt)).toBeLessThanOrEqual(0)
          expect(moment(communities[2].createdAt).diff(communities[3].createdAt)).toBeLessThanOrEqual(0)
          expect(communities).not.toContainEqual(secondPageCommunity)
          done()
        })
    })

    test('pagination works', async (done) => {
      await Community.truncate({cascade: true})
      const _ = await factory.createMany('Community', 8)

      request(app)
        .get('/communities?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { communities: communities1 } = response.body

          expect(communities1).toHaveLength(5)

          request(app)
            .get('/communities?page=2&per=5')
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { communities: communities2 } = response.body

              expect(communities2).toHaveLength(3)
              done()
            })
        })
    })
  })

  describe('GET /communities/1', () => {
    test('gets a single communities', async (done) => {
      const _communities1 = await factory.createMany('Community', 2)
      const _community = await factory.create('Community')
      const _communities2 = await factory.createMany('Community', 3)

      request(app)
        .get(`/communities/${_community.id}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { community } = response.body
          expect(community).toEqual(R.pickAll(expectedAttributes, _community))
          done()
        })
    })

    test('returns a 404 if not found', async (done) => {
      request(app)
        .get('/communities/0')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { community } = response.body
          expect(community).toBeNull()
          expect(response.status).toBe(404)
          done()
        })
    })
  })

  describe('PUT /communities/1', () => {
    test('successfully updates a communities', async (done) => {
      const _keycode = await factory.create('Keycode')
      const _communities = await factory.create('Community', {
        name: "Green Acres",
        crossStreets: "My St. & Your St.",
        zipCode: "12345",
        state: "NY"
      })

      request(app)
        .put(`/communities/${_communities.id}`)
        .set('Authorization', token)
        .send({ 
          community: {
            crossStreets: "Your St. & My St.",
            address2: "Apt. G",
            keycodeId: null,
            zipCode: "54321-1234"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { community } = response.body
          expect(community.crossStreets).toBe("Your St. & My St.")
          expect(community.zipCode).toBe("54321-1234")
          expect(community.state).toBe("NY")
          done()
        })
    })

    test('failure to update a communities gives a 422', async (done) => {
      const _communities = await factory.create('Community')

      request(app)
        .put(`/communities/${_communities.id}`)
        .set('Authorization', token)
        .send({ 
          community: {
            crossStreets: null,
            zipCode: "abcd-123"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain("Community.crossStreets cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          done()
        })
    })
  })

  describe('POST /communities', () => {
    test('returns the communities that was just created', async (done) => {
      const _community = await factory.create('Community')
      const _builder = await factory.create('Builder')
      request(app)
        .post('/communities')
        .set('Authorization', token)
        .send({
          community: {
            name: "Green Acres",
            crossStreets: "7th and Gordon st.",
            city: "Anytown",
            state: "AZ",
            zipCode: "12345-1234",
            builderIds: [_builder.id],
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(201);
          const { community } = response.body;
          expect(community.crossStreets).toBe("7th and Gordon st.")
          expect(community.city).toBe("Anytown")
          expect(community.state).toBe("AZ")
          expect(community.zipCode).toBe("12345-1234")
          done()
        })
    });

    test('It returns any validation errors', async (done) => {
      request(app)
        .post('/communities')
        .set('Authorization', token)
        .send({
          "community": {
            "address1": null, // can't be null
            "address2": "",
            "city": null, // can't be null
            "state": "ZZ", // not a real state
            "zipCode": "12345-", // not a valid zip code
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain("Community.city cannot be null")
          expect(errors).toContain("Community.crossStreets cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          expect(errors).toContain("Validation isIn on state failed")
          done()
        })
    });
  });
})
