import faker from '@faker-js/faker'

import { DbLoadAccountByToken } from '@/data/usecases'
import {
  DecrypterSpy,
  LoadAccountByTokenRepositorySpy
} from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

const token = faker.datatype.uuid()
const role = faker.random.word()

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  )
  return { sut, decrypterSpy, loadAccountByTokenRepositorySpy }
}

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct ciphertext', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const res = await sut.load(token, role)
    expect(res).toBeNull()
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const res = await sut.load(token, role)
    expect(res).toBeNull()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError)
    const res = sut.load(token, role)
    await expect(res).rejects.toThrow()
  })

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.result = null
    const res = await sut.load(token, role)
    expect(res).toBeNull()
  })

  it('should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const res = await sut.load(token, role)
    expect(res).toEqual(loadAccountByTokenRepositorySpy.result)
  })
})
