import { Express } from 'express'
import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let accountCollection: Collection
let app: Express

describe('Account Routes', () => {
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

  describe('POST /accounts/signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/accounts/signup')
        .send({
          email: 'any_email@mail.com',
          username: 'any_username',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
      await request(app)
        .post('/api/accounts/signup')
        .send({
          email: 'any_email@mail.com',
          username: 'any_username',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(403)
    })
  })

  describe('POST /accounts/login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('any_password', 12)
      await accountCollection.insertOne({
        email: 'any_email@mail.com',
        username: 'any_username',
        password
      })
      await request(app)
        .post('/api/accounts/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/accounts/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
