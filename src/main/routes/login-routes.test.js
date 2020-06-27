const MongoHelper = require('../../infra/helpers/mongo-helper')
const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
let userModel

describe('Login Router', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 when valid credencials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  test('Should return 401 when invalid credencials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'invalid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(401)
  })
})
