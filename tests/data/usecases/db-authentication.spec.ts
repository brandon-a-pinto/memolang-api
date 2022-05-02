import { DbAuthentication } from '@/data/usecases'
import {
  LoadAccountByEmailRepositorySpy,
  HasherComparerSpy,
  EncrypterSpy,
  UpdateTokenRepositoryMock
} from '@/tests/data/mocks'
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hasherComparerSpy: HasherComparerSpy
  encrypterSpy: EncrypterSpy
  updateTokenRepositoryMock: UpdateTokenRepositoryMock
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hasherComparerSpy = new HasherComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateTokenRepositoryMock = new UpdateTokenRepositoryMock()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hasherComparerSpy,
    encrypterSpy,
    updateTokenRepositoryMock
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hasherComparerSpy,
    encrypterSpy,
    updateTokenRepositoryMock
  }
}

describe('DbAuthentication Usecase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(loadAccountByEmailRepositorySpy.email).toEqual(data.email)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = null
    const res = await sut.auth(mockAuthenticationParams())
    expect(res).toBeNull()
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call HasherComparer with correct values', async () => {
    const { sut, hasherComparerSpy, loadAccountByEmailRepositorySpy } =
      makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(hasherComparerSpy.plaintext).toBe(data.password)
    expect(hasherComparerSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.result.password
    )
  })

  it('should return null if HasherComparer returns false', async () => {
    const { sut, hasherComparerSpy } = makeSut()
    hasherComparerSpy.result = false
    const res = await sut.auth(mockAuthenticationParams())
    expect(res).toBeNull()
  })

  it('should throw if HasherComparer throws', async () => {
    const { sut, hasherComparerSpy } = makeSut()
    jest.spyOn(hasherComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterSpy.plaintext).toBe(
      loadAccountByEmailRepositorySpy.result.id
    )
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return access token on success', async () => {
    const { sut, encrypterSpy } = makeSut()
    const { accessToken } = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })

  it('should call UpdateTokenRepository with correct values', async () => {
    const {
      sut,
      updateTokenRepositoryMock,
      loadAccountByEmailRepositorySpy,
      encrypterSpy
    } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(updateTokenRepositoryMock.id).toBe(
      loadAccountByEmailRepositorySpy.result.id
    )
    expect(updateTokenRepositoryMock.token).toBe(encrypterSpy.ciphertext)
  })

  it('should throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryMock } = makeSut()
    jest
      .spyOn(updateTokenRepositoryMock, 'updateToken')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
