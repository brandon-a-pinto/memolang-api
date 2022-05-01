import { DbAddDeck } from '@/data/usecases'
import { AddDeckRepositoryMock } from '@/tests/data/mocks'
import { mockAddDeckParams } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddDeck
  addDeckRepositoryMock: AddDeckRepositoryMock
}

const makeSut = (): SutTypes => {
  const addDeckRepositoryMock = new AddDeckRepositoryMock()
  const sut = new DbAddDeck(addDeckRepositoryMock)
  return { sut, addDeckRepositoryMock }
}

describe('DbAddDeck Usecase', () => {
  it('Should call AddDeckRepository with correct values', async () => {
    const { sut, addDeckRepositoryMock } = makeSut()
    const data = mockAddDeckParams()
    await sut.add(data)
    expect(addDeckRepositoryMock.params).toEqual(data)
  })
})
