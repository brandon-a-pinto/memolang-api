import { Collection, ObjectId } from 'mongodb'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

let accountCollection: Collection
let deckCollection: Collection
let app: Express

const mockAccount = async (): Promise<{
  accessToken: string
  id: ObjectId
}> => {
  const res = await accountCollection.insertOne({
    email: 'any_email@mail.com',
    username: 'any_username',
    password: 'any_password',
    role: 'admin'
  })
  const accessToken = sign({ id: res.insertedId }, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: res.insertedId },
    { $set: { accessToken } }
  )
  return { accessToken, id: res.insertedId }
}

describe('Deck GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    deckCollection = MongoHelper.getCollection('decks')
    await deckCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('LoadAll Query', () => {
    const query = `query {
      loadAll {
        id
        title
        language
        ownerId
        flashcards {
          front {
            content
            howToRead
          }
          back {
            content
            glossary {
              words
              meanings
            }
          }
        }
      }
    }`

    it('should return Decks', async () => {
      const { accessToken, id } = await mockAccount()
      await deckCollection.insertOne({
        title: 'any_title',
        language: 'any_language',
        ownerId: id
      })
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.loadAll.length).toBe(1)
      expect(res.body.data.loadAll[0].id).toBeTruthy()
      expect(res.body.data.loadAll[0].ownerId).toEqual(id.toHexString())
      expect(res.body.data.loadAll[0].title).toBe('any_title')
      expect(res.body.data.loadAll[0].language).toBe('any_language')
      expect(res.body.data.loadAll[0].flashcards).toBeFalsy()
    })

    it('should return AccessDeniedError if no token is provided', async () => {
      const { id } = await mockAccount()
      await deckCollection.insertOne({
        title: 'any_title',
        language: 'any_language',
        ownerId: id
      })
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError')
    })
  })
})
