import { Collection } from 'mongodb'
import FakeObjectId from 'bson-objectid'

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
      const { front, back } = mockAddFlashcardParams()
      await sut.addFlashcard({
        ownerId: id.toHexString(),
        deckId: deck._id.toHexString(),
        front,
        back
      })
      const res = await deckCollection.findOne({ _id: deck._id })
      expect(res).toBeTruthy()
      expect(res.flashcards).toEqual([{ front, back }])
    })
  })

  describe('checkByOwnerId()', () => {
    it('should return true if user is the owner', async () => {
      const sut = makeSut()
      const { deck, id } = await mockData()
      const res = await sut.checkByOwnerId(
        id.toHexString(),
        deck._id.toHexString()
      )
      expect(res).toBe(true)
    })

    it('should return false if user is not the owner', async () => {
      const sut = makeSut()
      const { deck } = await mockData()
      const res = await sut.checkByOwnerId(
        new FakeObjectId().toHexString(),
        deck._id.toHexString()
      )
      expect(res).toBe(false)
    })
  })

  describe('load()', () => {
    it('should load an array of decks', async () => {
      const sut = makeSut()
      const { deck } = await mockData()
      const decks = await sut.load(deck.ownerId)
      expect(decks.length).toBe(1)
      expect(decks[0].id).toEqual(deck._id)
      expect(decks[0].ownerId).toEqual(deck.ownerId)
    })

    it('should load an empty array', async () => {
      const sut = makeSut()
      const account = await accountCollection.insertOne(mockAddAccountParams())
      const res = await sut.load(account.insertedId.toHexString())
      expect(res.length).toBe(0)
    })
  })
})
