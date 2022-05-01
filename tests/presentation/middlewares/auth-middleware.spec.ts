import faker from '@faker-js/faker'

import { AuthMiddleware } from '@/presentation/middlewares'
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.datatype.uuid()
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return { sut, loadAccountByTokenSpy }
}

describe('Auth Middleware', () => {
  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word()
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const req = mockRequest()
    await sut.perform(req)
    expect(loadAccountByTokenSpy.token).toBe(req.accessToken)
  })

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError)
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(serverError(new Error()))
  })

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    const res = await sut.perform(mockRequest())
    expect(res).toEqual(ok({ accountId: loadAccountByTokenSpy.result.id }))
  })

  it('should return 403 if no x-access-token exists in header', async () => {
    const { sut } = makeSut()
    const res = await sut.perform({})
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
})
