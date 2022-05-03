import { DbAddFlashcard } from '@/data/usecases'
import {
  CheckDeckByOwnerIdRepositorySpy,
  AddFlashcardRepositorySpy
} from '@/tests/data/mocks'
import { mockAddFlashcardParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddFlashcard
  checkDeckByOwnerIdRepositorySpy: CheckDeckByOwnerIdRepositorySpy
  addFlashcardRepositorySpy: AddFlashcardRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkDeckByOwnerIdRepositorySpy = new CheckDeckByOwnerIdRepositorySpy()
  const addFlashcardRepositorySpy = new AddFlashcardRepositorySpy()
  const sut = new DbAddFlashcard(
    checkDeckByOwnerIdRepositorySpy,
    addFlashcardRepositorySpy
  )
  return { sut, checkDeckByOwnerIdRepositorySpy, addFlashcardRepositorySpy }
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

  it('should return false if CheckDeckByOwnerIdRepository returns false', async () => {
    const { sut, checkDeckByOwnerIdRepositorySpy } = makeSut()
    checkDeckByOwnerIdRepositorySpy.result = false
    const res = await sut.add(mockAddFlashcardParams())
    expect(res).toBe(false)
  })
})
