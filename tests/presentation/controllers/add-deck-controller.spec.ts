import faker from '@faker-js/faker'

import { AddDeckController } from '@/presentation/controllers'
import { ValidationSpy, AddDeckMock } from '@/tests/presentation/mocks'
import { ServerError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): AddDeckController.Request => ({
  accountId: faker.datatype.uuid(),
  title: faker.random.words(),
  language: faker.random.word()
})

type SutTypes = {
  sut: AddDeckController
  validationSpy: ValidationSpy
  addDeckMock: AddDeckMock
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addDeckMock = new AddDeckMock()
  const sut = new AddDeckController(validationSpy, addDeckMock)
  return { sut, validationSpy, addDeckMock }
}

describe('AddDeck Controller', () => {
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

  it('should call AddDeck with correct values', async () => {
    const { sut, addDeckMock } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(addDeckMock.params).toEqual({
      ownerId: req.accountId,
      title: req.title,
      language: req.language
    })
  })

  it('should throw if AddDeck throws', async () => {
    const { sut, addDeckMock } = makeSut()
    jest.spyOn(addDeckMock, 'add').mockImplementationOnce(throwError)
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(serverError(new ServerError(null)))
  })
})
