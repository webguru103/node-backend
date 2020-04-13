const request = require('supertest');
const app = require('../../app');
const { User } = require('../../app/models');
const bcrypt = require('bcrypt');
const { clean } = require('../test_utils');

beforeAll(async () => {
  await clean()
  const encryptedPassword = await bcrypt.hash("S3kr1t123", 10);
  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    encryptedPassword,
  });
});

describe('POST /login', () => {
  test('It returns a JWT token with the correct credentials', async (done) => {
    const response = await request(app)
            .post('/login')
            .send({email: "admin@example.com", password: "S3kr1t123"})
    const { token, id } = response.body
    expect(response.statusCode).toBe(200);
    expect(token).toBeTruthy();
    expect(id).toBeTruthy();
    done()
  });

  test('It returns nothing with incorrect credentials', async (done) => {
    const response = await request(app)
            .post('/login')
            .send({email: "admin@example.com", password: "notright"})
    const { id, token } = response.body
    expect(response.statusCode).toBe(401);
    expect(token).toBeFalsy();
    expect(id).toBeFalsy();
    done()
  });
});
