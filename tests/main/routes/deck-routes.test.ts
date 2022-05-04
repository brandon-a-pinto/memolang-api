import { Express } from 'express'
import request from 'supertest'
import { Collection, ObjectId } from 'mongodb'
import { sign } from 'jsonwebtoken'

import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
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

describe('Deck Routes', () => {
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

  describe('POST /decks', () => {
    it('should return 204 on add deck', async () => {
      const { accessToken } = await mockAccount()
      await request(app)
        .post('/api/decks')
        .send({
          title: 'any_title',
          language: 'any_language'
        })
        .set('x-access-token', accessToken)
        .expect(204)
    })

    it('should return 403 on add deck without accessToken', async () => {
      await request(app)
        .post('/api/decks')
        .send({
          title: 'any_title',
          language: 'any_language'
        })
        .expect(403)
    })
  })

  describe('PUT /decks/:deckId/add-card', () => {
    it('should return 204 on add flashcard', async () => {
      const { accessToken, id } = await mockAccount()
      const deck = await deckCollection.insertOne({
        title: 'any_title',
        language: 'any_language',
        ownerId: id
      })
      await request(app)
        .put(`/api/decks/${deck.insertedId.toHexString()}/add-card`)
        .send({
          front: {
            content: 'any_content',
            howToRead: 'any_howToRead'
          },
          back: {
            content: 'any_content',
            glossary: {
              words: ['any_word'],
              meanings: ['any_meaning']
            }
          }
        })
        .set('x-access-token', accessToken)
        .expect(204)
    })

    it('should return 403 on add flashcard without accessToken', async () => {
      const { id } = await mockAccount()
      const deck = await deckCollection.insertOne({
        title: 'any_title',
        language: 'any_language',
        ownerId: id
      })
      await request(app)
        .put(`/api/decks/${deck.insertedId.toHexString()}/add-card`)
        .send({
          front: {
            content: 'any_content',
            howToRead: 'any_howToRead'
          },
          back: {
            content: 'any_content',
            glossary: {
              words: ['any_word'],
              meanings: ['any_meaning']
            }
          }
        })
        .expect(403)
    })
  })

  describe('GET /decks/:ownerId', () => {
    it('should return 200 on load decks', async () => {
      const { accessToken, id } = await mockAccount()
      await deckCollection.insertOne({
        title: 'any_title',
        language: 'any_language',
        ownerId: id
      })
      await request(app)
        .get(`/api/decks/${id.toHexString()}`)
        .set('x-access-token', accessToken)
        .expect(200)
    })

    it('should return 204 on load decks', async () => {
      const { accessToken, id } = await mockAccount()
      await request(app)
        .get(`/api/decks/${id.toHexString()}`)
        .set('x-access-token', accessToken)
        .expect(204)
    })

    it('should return 403 on load decks without accessToken', async () => {
      const { id } = await mockAccount()
      await request(app).get(`/api/decks/${id.toHexString()}`).expect(403)
    })
  })
})
