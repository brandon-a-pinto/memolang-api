import faker from '@faker-js/faker'

import { DbLoadDecks } from '@/data/usecases'
import { LoadDecksRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbLoadDecks
  loadDecksRepositorySpy: LoadDecksRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadDecksRepositorySpy = new LoadDecksRepositorySpy()
  const sut = new DbLoadDecks(loadDecksRepositorySpy)
  return { sut, loadDecksRepositorySpy }
}

describe('DbLoadDecks Usecase', () => {
  it('Should call LoadDecksRepository with correct values', async () => {
    const { sut, loadDecksRepositorySpy } = makeSut()
    const ownerId = faker.datatype.uuid()
    await sut.load(ownerId)
    expect(loadDecksRepositorySpy.ownerId).toBe(ownerId)
  })
})
