import faker from '@faker-js/faker'

import { SignUpController } from '@/presentation/controllers'
import {
  ValidationSpy,
  AddAccountSpy,
  AuthenticationSpy
} from '@/tests/presentation/mocks'
import { ServerError, EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError, forbidden } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const password = faker.internet.password()

const mockRequest = (): SignUpController.Request => ({
  email: faker.internet.email(),
  username: faker.name.firstName(),
  password,
  passwordConfirmation: password
})

type SutTypes = {
  sut: SignUpController
  validationSpy: ValidationSpy
  addAccountSpy: AddAccountSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(
    validationSpy,
    addAccountSpy,
    authenticationSpy
  )
  return { sut, validationSpy, addAccountSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
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

  it('should return 200 on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(ok(authenticationSpy.result))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const req = mockRequest()
    await sut.perform(req)
    expect(addAccountSpy.params).toEqual({
      email: req.email,
      username: req.username,
      password: req.password
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(serverError(new ServerError(null)))
  })

  it('should return 403 if AddAccount returns false', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = false
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(forbidden(new EmailInUseError()))
  })
})
