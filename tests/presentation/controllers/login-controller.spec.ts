import faker from '@faker-js/faker'

import { LoginController } from '@/presentation/controllers'
import { ValidationSpy, AuthenticationSpy } from '@/tests/presentation/mocks'
import { ServerError } from '@/presentation/errors'
import {
  ok,
  badRequest,
  serverError,
  unauthorized
} from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: LoginController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)
  return { sut, validationSpy, authenticationSpy }
}

describe('LoginController', () => {
  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(badRequest(new Error()))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(validationSpy.input).toEqual(req)
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(serverError(new ServerError(null)))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(authenticationSpy.params).toEqual(req)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(unauthorized())
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(ok(authenticationSpy.result))
  })
})
