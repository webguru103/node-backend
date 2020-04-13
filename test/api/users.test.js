const request = require('supertest');
const bcrypt = require('bcrypt');
const R = require('ramda');
const moment = require('moment');
const jwt = require('jwt-simple');

const app = require('../../app');

const { User } = require('../../app/models');
const { clean } = require('../test_utils');

const factory = require('../factories');

const { encryptedPassword } = require('../../app/utils')

const userExpectedAttributes = [
  'id', 'email', 'firstName', 'lastName', 'admin'
]

const deviceExpectedAttributes = [
  'appVersion', 'appType', 'deviceOS', 'deviceType', 'userId', 'id'
]

let token;
let user;

describe('users', () => {
  let token
  beforeEach(async (done) => {
    try {
      await clean()
      const encryptedPassword = await bcrypt.hash("S3kr1t123", 10);
      user = await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        encryptedPassword,
      });
      token = 'Bearer ' + jwt.encode({ id: user.id, email: user.email }, process.env.JWT_SECRET);
      done(null, token)
    } catch (error) {
      done(error, null)
    }
  })

  describe("POST /users", async () => {
    test('It returns the user that was just created', async (done) => {
      request(app)
        .post('/users')
        .set('Authorization', token)
        .send({
          user: {
            firstName: "Joe",
            lastName: "Theismann",
            email: "joe+123@example.com",
            password: "thisIsMyP@ssword1",
            passwordConfirmation: "thisIsMyP@ssword1"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { user: _user } = response.body

          expect(response.statusCode).toBe(201);
          expect(_user.id).toBeTruthy()
          expect(_user).toBeTruthy()
          done()
        })
    });

    test('It returns validation errors', async (done) => {
      await factory.create('User', {email: "alreadyexists@example.com"})
      request(app)
        .post('/users')
        .set('Authorization', token)
        .send({
          user: {
            firstName: null,
            lastName: null,
            email: "alreadyexists@example.com",
            password: "word",
            passwordConfirmation: "wordup"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          const { errors } = response.body;
          expect(errors).toContain(`Email alreadyexists@example.com has already been taken`)
          expect(errors).toContain("User.firstName cannot be null")
          expect(errors).toContain("User.lastName cannot be null")
          expect(errors).toContain(
            "Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters"
          )
          expect(errors).toContain("Passwords do not match")
          done()
        })
    })
  })

  describe('GET /users/1', () => {
    beforeAll(async(done) => {
      user = await factory.create('User');
      done();
    });

    test('gets a single user', async (done) => {
      const _user = user
      request(app).get(`/users/${_user.id}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { user } = response.body
          expect(user).toEqual(R.pickAll(userExpectedAttributes, _user));
          expect(response.body).not.toHaveProperty('device');
          done()
        })
    })

    test('returns a 404 if not found', async (done) => {
      request(app)
        .get('/users/0')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { user } = response.body
          expect(user).toBeNull()
          expect(response.status).toBe(404)
          done()
        })
    })

    test('returns device information when available', async (done) => {
      const _device = await factory.create('Device', {
        appVersion: '1.2.3',
        appType: 'admin',
        deviceOS: 'Android 8.0',
        deviceType: 'Nexus One',
        userId: user.id,
      });

      request(app).get(`/users/${user.id}`)
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          let { device } = response.body;
          expect(device).toEqual(R.pickAll(deviceExpectedAttributes, _device));
          done()
        })
    })
  })

  describe("GET /users", () => {
    test('it gets a paginated list of users', async (done) => {
      const users = await factory.createMany('User', 8)
      users.forEach(async user => {
        await factory.create('Device', {userId: user.id})
      })

      request(app)
        .get('/users?page=1&per=5')
        .set('Authorization', token)
        .end((err, response) => {
          if (err) fail(err)
          const { count, users: users1 } = response.body

          expect(count).toEqual(9)
          expect(users1).toHaveLength(5)

          request(app)
            .get('/users?page=2&per=5')
            .set('Authorization', token)
            .end((err, response) => {
              if (err) fail(err)
              const { users: users2 } = response.body
              const { user: user2, devices: devices2 } = users2[0]

              expect(users2).toHaveLength(4) // +1 for beforeEach user
              expect(user2.id).toBeTruthy()
              expect(user2.firstName).toBeTruthy()
              expect(user2.lastName).toBeTruthy()
              expect(user2.email).toBeTruthy()
              expect(user2.password).toBeUndefined()
              expect(user2.passwordConfirmation).toBeUndefined()

              expect(devices2[0].appVersion).toBeTruthy()
              expect(devices2[0].appType).toBeTruthy()
              expect(devices2[0].deviceOS).toBeTruthy()
              expect(devices2[0].userId).toBeTruthy()

              done()
            })
        })
    })
  })

  describe('PUT /users/1', () => {
    test('successfully updates a user', async (done) => {
      const _encryptedPassword = encryptedPassword("abcdefg123")
      const _user = await factory.create('User', {
        email: "foobar@example.com",
        firstName: "ding",
        lastName: "dong",
        encryptedPassword: _encryptedPassword,
      })

      request(app)
        .put(`/users/${_user.id}`)
        .set('Authorization', token)
        .send({
          user: {
            firstName: "Jerry",
            lastName: "Seinfeld",
            password: "This!Is!Great1",
            passwordConfirmation: "This!Is!Great1"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(200);
          const { user: _user } = response.body
          expect(_user.firstName).toBe("Jerry")
          expect(_user.lastName).toBe("Seinfeld")

          request(app)
            .put(`/users/${_user.id}`)
            .set('Authorization', token)
            .send({
              user: {
                email: "Jerry@example.com"
              }
            })
            .end((err, response2) => {
              if (err) fail(err)
              expect(response.statusCode).toBe(200);
              const { user: _user2 } = response2.body
              expect(_user2.email).toBe("Jerry@example.com")
              done()
            })
        })
    })

    test('successfully updates a password', async (done) => {
      const _encryptedPassword = encryptedPassword("abcdefg123")
      const _user = await factory.create('User', {
        email: "jerry@example.com",
        firstName: "ding",
        lastName: "dong",
        encryptedPassword: _encryptedPassword,
      })

      request(app)
        .put(`/users/${_user.id}`)
        .set('Authorization', token)
        .send({
          user: {
            firstName: "Jerry",
            lastName: "Seinfeld",
            password: "This!Is!Great1",
            passwordConfirmation: "This!Is!Great1"
          }
        })
        .end(async (err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(200);
          const { user: _user } = response.body
          expect(_user.firstName).toBe("Jerry")
          expect(_user.lastName).toBe("Seinfeld")

          const response2 = await request(app)
                  .post('/login')
                  .send({email: "jerry@example.com", password: "This!Is!Great1"})
          const { token, id } = response2.body
          expect(response2.statusCode).toBe(200);
          expect(token).toBeTruthy();
          expect(id).toBeTruthy();
          done()
        })
    })

    test('failure to update a user gives a 422', async (done) => {
      const _existingUser = await factory.create('User', { email: "alreadyexists@example.com"})
      const _encryptedPassword = encryptedPassword("abcdefg123")
      const _user = await factory.create('User', {
        email: "foobar@example.com",
        firstName: "ding",
        lastName: "dong",
        encryptedPassword: _encryptedPassword,
      })

      request(app)
        .put(`/users/${_user.id}`)
        .set('Authorization', token)
        .send({
          user: {
            firstName: null,
            lastName: null,
            email: "alreadyexists@example.com",
            password: "ding",
            passwordConfirmation: "dong"
          }
        })
        .end((err, response) => {
          if (err) fail(err)
          expect(response.statusCode).toBe(422);
          const { errors } = response.body;
          expect(errors).toContain(`Email alreadyexists@example.com has already been taken`)
          expect(errors).toContain("User.firstName cannot be null")
          expect(errors).toContain("User.lastName cannot be null")
          expect(errors).toContain(
            "Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters"
          )
          expect(errors).toContain("Passwords do not match")
          done()
        })
    })
  })
})
