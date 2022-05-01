import { Collection } from 'mongodb'
import faker from '@faker-js/faker'

import { MongoHelper, AccountMongoRepository } from '@/infra/db'
import { mockAddAccountParams } from '@/tests/domain/mocks'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('should add account on success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBe(true)
    })
  })

  describe('checkByEmail()', () => {
    it('should return true if email is valid', async () => {
      const sut = makeSut()
      const data = mockAddAccountParams()
      await accountCollection.insertOne(data)
      const account = await sut.checkByEmail(data.email)
      expect(account).toBe(true)
    })

    it('should return false if email is not valid', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.checkByEmail(faker.internet.email())
      expect(account).toBe(false)
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const data = mockAddAccountParams()
      await accountCollection.insertOne(data)
      const account = await sut.loadByEmail(data.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.username).toBe(data.username)
      expect(account.password).toBe(data.password)
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateToken()', () => {
    it('should update account token on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = await accountCollection.findOne({
        _id: res.insertedId
      })
      expect(fakeAccount.accessToken).toBeFalsy()
      const token = faker.datatype.uuid()
      await sut.updateToken(fakeAccount._id.toHexString(), token)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(token)
    })
  })

  describe('loadByToken', () => {
    let accessToken = faker.datatype.uuid()

    beforeEach(() => {
      accessToken = faker.datatype.uuid()
    })

    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    it('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
