import { DbAddAccount } from '@/data/usecases'
import {
  CheckAccountByEmailRepositorySpy,
  HasherSpy,
  AddAccountRepositorySpy
} from '@/tests/data/mocks'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddAccount
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
  )
  return {
    sut,
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  it('should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const res = await sut.add(mockAddAccountParams())
    expect(res).toBe(false)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()
    const res = await sut.add(mockAddAccountParams())
    expect(res).toBe(true)
  })

  it('should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut()
    const data = mockAddAccountParams()
    await sut.add(data)
    expect(hasherSpy.plaintext).toBe(data.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const data = mockAddAccountParams()
    await sut.add(data)
    expect(addAccountRepositorySpy.params).toEqual({
      email: data.email,
      username: data.username,
      password: hasherSpy.digest
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.result = false
    const res = await sut.add(mockAddAccountParams())
    expect(res).toBe(false)
  })
})
