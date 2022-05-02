import faker from '@faker-js/faker'

import { AddFlashcardController } from '@/presentation/controllers'
import { ValidationSpy, AddFlashcardSpy } from '@/tests/presentation/mocks'
import { badRequest, noContent } from '@/presentation/helpers'

const mockRequest = (): AddFlashcardController.Request => ({
  deckId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  flashcard: {
    front: {
      content: faker.random.words(),
      howToRead: faker.random.words()
    },
    back: {
      content: faker.random.words(),
      glossary: {
        words: [faker.random.word()],
        meanings: [faker.random.word()]
      }
    }
  }
})

type SutTypes = {
  sut: AddFlashcardController
  validationSpy: ValidationSpy
  addFlashcardSpy: AddFlashcardSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addFlashcardSpy = new AddFlashcardSpy()
  const sut = new AddFlashcardController(validationSpy, addFlashcardSpy)
  return { sut, validationSpy, addFlashcardSpy }
}

describe('AddFlashcard Controller', () => {
  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(badRequest(validationSpy.error))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(validationSpy.input).toEqual(req)
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(noContent())
  })
})
