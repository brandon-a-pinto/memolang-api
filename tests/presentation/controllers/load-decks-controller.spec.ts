import faker from '@faker-js/faker'

import { LoadDecksController } from '@/presentation/controllers'
import { LoadDecksSpy } from '@/tests/presentation/mocks'
import { ok, noContent } from '@/presentation/helpers'

const mockRequest = (): LoadDecksController.Request => ({
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadDecksController
  loadDecksSpy: LoadDecksSpy
}

const makeSut = (): SutTypes => {
  const loadDecksSpy = new LoadDecksSpy()
  const sut = new LoadDecksController(loadDecksSpy)
  return { sut, loadDecksSpy }
}

describe('LoadDecks Controller', () => {
  it('should call LoadDecks with correct values', async () => {
    const { sut, loadDecksSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(loadDecksSpy.ownerId).toEqual(req.accountId)
  })

  it('should return 200 if LoadDecks returns an array of decks', async () => {
    const { sut, loadDecksSpy } = makeSut()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(ok(loadDecksSpy.result))
  })

  it('should return 204 if LoadDecks returns empty', async () => {
    const { sut, loadDecksSpy } = makeSut()
    loadDecksSpy.result = []
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(noContent())
  })
})
