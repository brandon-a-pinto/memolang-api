import { DbAddDeck } from '@/data/usecases'
import { AddDeckRepositoryMock } from '@/tests/data/mocks'
import { mockAddDeckParams, throwError } from '@/tests/domain/mocks'

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
  it('should call AddDeckRepository with correct values', async () => {
    const { sut, addDeckRepositoryMock } = makeSut()
    const data = mockAddDeckParams()
    await sut.add(data)
    expect(addDeckRepositoryMock.params).toEqual(data)
  })

  it('should throw if AddDeckRepository throws', async () => {
    const { sut, addDeckRepositoryMock } = makeSut()
    jest.spyOn(addDeckRepositoryMock, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddDeckParams())
    await expect(promise).rejects.toThrow()
  })
})
