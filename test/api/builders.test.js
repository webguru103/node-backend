const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const jwt = require('jwt-simple');

const app = require('../../app');
const { User, Builder } = require('../../app/models');

const factory = require('../factories');
const { clean } = require('../test_utils');

describe('builders', () => {
  const expectedAttributes = [
    'id', 'companyName', 'companyPhone', 'mainContactName', 'mainContactEmail', 'mainContactPhone', 'address1',
    'address2', 'city', 'state', 'zipCode'
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

  describe('GET /builders', async () => {
    test('returns a list of builders, limit 10 in descending order by default', async (done) => {
      const secondPageBuilder = await factory.create('Builder')
      const _ = await factory.createMany('Builder', 10)
      request(app)
        .get('/builders')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, builders } = response.body

          const expectedBuilders = builders.map(builder => Object.assign({},
            R.pickAll(expectedAttributes, builder),
            { homesCount: 0, activatedHomes: 0, communities: [] })
          )

          expect(count).toEqual(11)
          expect(builders).toHaveLength(10)
          expect(builders).toEqual(expectedBuilders)
          expect(builders[0].id).toBeGreaterThan(builders[1].id)
          expect(builders[1].id).toBeGreaterThan(builders[2].id)
          expect(builders[2].id).toBeGreaterThan(builders[3].id)
          expect(builders).not.toContainEqual(secondPageBuilder)
          done()
        })
    })

    test('pagination works', async (done) => {
      await Builder.truncate({cascade: true})
      const _ = await factory.createMany('Builder', 8)

      request(app)
        .get('/builders?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { builders: builders1 } = response.body

          expect(builders1).toHaveLength(5)

          request(app)
            .get('/builders?page=2&per=5')
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { builders: builders2 } = response.body

              expect(builders2).toHaveLength(3)
              done()
            })
        })
    })

    test('returns a sorted list by builder name', async (done) => {
      await Builder.truncate({cascade: true})

      const builder1 = await factory.create('Builder', { companyName: "Def Jam Records"})
      const builder2 = await factory.create('Builder', { companyName: "Octan Corp."})
      const builder3 = await factory.create('Builder', { companyName: "Acme Corp."})

      // Default sort id DESC
      request(app)
        .get('/builders')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.statusCode).toBe(200);
          const { count: count1, builders: builders1 } = response.body
          expect(count1).toEqual(3)
          expect(builders1).toHaveLength(3)
          expect(builders1.map(builder => builder.id)).toEqual([builder3.id, builder2.id, builder1.id])

          // Builder.* sort DESC
          request(app)
            .get('/builders?sort=companyName:desc')
            .set('Authorization', token)
            .end((err, response) => {
              expect(response.statusCode).toBe(200);
              const { count: count2, builders: builders2 } = response.body
              expect(count2).toEqual(3)
              expect(builders2).toHaveLength(3)
              expect(builders2.map(builder => builder.companyName)).toEqual(['Octan Corp.', 'Def Jam Records', 'Acme Corp.'])

              done()
          })
        })
    })
  })

  describe('GET /builders/1', () => {
    test('gets a single builder', async (done) => {
      const _builders1 = await factory.createMany('Builder', 2)
      const _builder = await factory.create('Builder')
      const _builders2 = await factory.createMany('Builder', 3)

      request(app)
        .get(`/builders/${_builder.id}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { builder } = response.body
          expect(builder).toEqual(R.pickAll(expectedAttributes, _builder))
          done()
        })
    })

    test('returns a 404 if not found', async (done) => {
      request(app)
        .get('/builders/0')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { builder } = response.body
          expect(builder).toBeNull()
          expect(response.status).toBe(404)
          done()
        })
    })
  })

  describe('PUT /builders/1', () => {
    test('successfully updates a builder', async (done) => {
      const _builder = await factory.create('Builder', {
        address1: "123 My st.", zipCode: "12345", address2: null, state: "NY",
      })
      const _communities = await factory.createMany('Community', 4)
      const communityIds = _communities.map(community => community.id)

      request(app)
        .put(`/builders/${_builder.id}`)
        .set('Authorization', token)
        .send({ 
          builder: {
            address1: "321 Your St.",
            address2: "Apt. G",
            zipCode: "54321-1234",
            communityIds
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { builder, communities } = response.body
          expect(builder.address1).toBe("321 Your St.")
          expect(builder.address2).toBe("Apt. G")
          expect(builder.zipCode).toBe("54321-1234")
          expect(builder.state).toBe("NY")
          expect(builder.communityIds).toEqual(communityIds)
          expect(communities.length).toBe(4)
          done()
        })
    })

    test('failure to update a builder gives a 422', async (done) => {
      const _builder = await factory.create('Builder')

      request(app)
        .put(`/builders/${_builder.id}`)
        .set('Authorization', token)
        .send({ 
          builder: {
            address1: null,
            zipCode: "abcd-123",
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain("Builder.address1 cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          done()
        })
    })
  })

  describe('POST /builders', () => {
    test('returns the builder that was just created', async (done) => {
      const _communities = await factory.createMany('Community', 3)
      const communityIds = _communities.map(community => community.id)
      request(app)
        .post('/builders')
        .set('Authorization', token)
        .send({
          builder: {
            address1: "234 My Street",
            address2: "",
            city: "Anytown",
            state: "AZ",
            zipCode: "12345-1234",
            companyName: "Acme Inc.",
            mainContactName: "Joe Theismann",
            mainContactPhone: "213-555-1111",
            companyPhone: "123-555-2223",
            communityIds,
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(201);
          const { builder, communities } = response.body;
          expect(builder.address1).toBe("234 My Street")
          expect(builder.address2).toBe("")
          expect(builder.city).toBe("Anytown")
          expect(builder.state).toBe("AZ")
          expect(builder.zipCode).toBe("12345-1234")
          expect(builder.communityIds).toEqual(communityIds)
          expect(communities.map(community => community.id)).toEqual(communityIds)
          done()
        })
    });

    test('It returns any validation errors', async (done) => {
      request(app)
        .post('/builders')
        .set('Authorization', token)
        .send({
          "builder": {
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
          expect(errors).toContain("Builder.city cannot be null")
          expect(errors).toContain("Builder.address1 cannot be null")
          expect(errors).toContain("Validation is on zipCode failed")
          expect(errors).toContain("Validation isIn on state failed")
          done()
        })
    });
  });
});
