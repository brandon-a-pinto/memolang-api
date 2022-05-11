import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

let accountCollection: Collection
let app: Express

describe('Account GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "any_email@mail.com", password: "any_password") {
        accessToken
      }
    }`

    it('should return an Account on valid credentials', async () => {
      const password = await hash('any_password', 8)
      await accountCollection.insertOne({
        email: 'any_email@mail.com',
        username: 'any_username',
        password
      })
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
    })

    it('should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signup (email: "any_email@mail.com", username: "any_username", password: "any_password", passwordConfirmation: "any_password")
    }`

    it('should return true on valid data', async () => {
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signup).toBe(true)
    })
  })
})
