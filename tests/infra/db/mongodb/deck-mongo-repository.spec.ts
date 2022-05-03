import { Collection } from 'mongodb'

import { MongoHelper, DeckMongoRepository } from '@/infra/db'
import {
  mockAddDeckParams,
  mockAddFlashcardParams,
  mockAddAccountParams
} from '@/tests/domain/mocks'

const mockData = async () => {
  const insertAccount = await accountCollection.insertOne(
    mockAddAccountParams()
  )
  const { title, language } = mockAddDeckParams()
  const insertDeck = await deckCollection.insertOne({
    title,
    language,
    ownerId: insertAccount.insertedId
  })
  const deck = await deckCollection.findOne({ _id: insertDeck.insertedId })
  return { deck, id: insertAccount.insertedId }
}

let accountCollection: Collection
let deckCollection: Collection

const makeSut = (): DeckMongoRepository => new DeckMongoRepository()

describe('DeckMongoRepository', () => {
  beforeAll(async () => {
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

  describe('add()', () => {
    it('should add a deck on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddDeckParams())
      const count = await deckCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('addFlashcard()', () => {
    it('should add a flashcard on success', async () => {
      const sut = makeSut()
      const { deck, id } = await mockData()
      const { flashcard } = mockAddFlashcardParams()
      await sut.addFlashcard({
        ownerId: id.toHexString(),
        deckId: deck._id.toHexString(),
        flashcard
      })
      const res = await deckCollection.findOne({ _id: deck._id })
      expect(res).toBeTruthy()
      expect(res.flashcards).toEqual([flashcard])
    })
  })
})
