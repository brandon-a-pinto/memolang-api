import { Collection } from 'mongodb'

import { MongoHelper, DeckMongoRepository } from '@/infra/db'
import { mockAddDeckParams } from '@/tests/domain/mocks'

let deckCollection: Collection

const makeSut = (): DeckMongoRepository => new DeckMongoRepository()

describe('DeckMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    deckCollection = MongoHelper.getCollection('decks')
    await deckCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('should add a deck on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddDeckParams())
      const count = await deckCollection.countDocuments()
      expect(count).toBe(1)
    })
  })
})
