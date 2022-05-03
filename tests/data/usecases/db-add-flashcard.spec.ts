import { DbAddFlashcard } from '@/data/usecases'
import { CheckDeckByOwnerIdRepositorySpy } from '@/tests/data/mocks'
import { mockAddFlashcardParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddFlashcard
  checkDeckByOwnerIdRepositorySpy: CheckDeckByOwnerIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkDeckByOwnerIdRepositorySpy = new CheckDeckByOwnerIdRepositorySpy()
  const sut = new DbAddFlashcard(checkDeckByOwnerIdRepositorySpy)
  return { sut, checkDeckByOwnerIdRepositorySpy }
}

describe('DbAddFlashcard Usecase', () => {
  it('should call CheckDeckByOwnerIdRepository with correct values', async () => {
    const { sut, checkDeckByOwnerIdRepositorySpy } = makeSut()
    const data = mockAddFlashcardParams()
    await sut.add(data)
    expect(checkDeckByOwnerIdRepositorySpy.deckId).toBe(data.deckId)
    expect(checkDeckByOwnerIdRepositorySpy.ownerId).toBe(data.ownerId)
  })

  it('should throw if CheckDeckByOwnerIdRepository throws', async () => {
    const { sut, checkDeckByOwnerIdRepositorySpy } = makeSut()
    jest
      .spyOn(checkDeckByOwnerIdRepositorySpy, 'checkByOwnerId')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddFlashcardParams())
    await expect(promise).rejects.toThrow()
  })
})
