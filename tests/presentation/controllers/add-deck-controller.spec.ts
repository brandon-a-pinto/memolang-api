import faker from '@faker-js/faker'

import { AddDeckController } from '@/presentation/controllers'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { badRequest } from '@/presentation/helpers'

const mockRequest = (): AddDeckController.Request => ({
  title: faker.random.words(),
  language: faker.random.word()
})

type SutTypes = {
  sut: AddDeckController
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new AddDeckController(validationSpy)
  return { sut, validationSpy }
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
})
