import faker from '@faker-js/faker'

import { AddFlashcardController } from '@/presentation/controllers'
import { ValidationSpy, AddFlashcardSpy } from '@/tests/presentation/mocks'
import { ServerError, InvalidUserError } from '@/presentation/errors'
import {
  badRequest,
  noContent,
  serverError,
  forbidden
} from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): AddFlashcardController.Request => ({
  deckId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
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

  it('should call AddFlashcard with correct values', async () => {
    const { sut, addFlashcardSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(addFlashcardSpy.params).toEqual({
      ownerId: req.accountId,
      deckId: req.deckId,
      front: req.front,
      back: req.back
    })
  })

  it('should throw if AddFlashcard throws', async () => {
    const { sut, addFlashcardSpy } = makeSut()
    jest.spyOn(addFlashcardSpy, 'add').mockImplementationOnce(throwError)
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(serverError(new ServerError(null)))
  })

  it('should return 403 if AddFlashcard returns false', async () => {
    const { sut, addFlashcardSpy } = makeSut()
    addFlashcardSpy.result = false
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(forbidden(new InvalidUserError()))
  })
})
