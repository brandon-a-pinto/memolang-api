import bcrypt from 'bcrypt'

import { BcryptAdapter } from '@/infra/cryptography'
import { throwError } from '@/tests/domain/mocks'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
  },

  async compare(): Promise<boolean> {
    return true
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    it('should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('should return a valid hash on success', async () => {
      const sut = makeSut()
      const res = await sut.hash('any_value')
      expect(res).toBe('hash')
    })

    it('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const res = sut.hash('any_value')
      await expect(res).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('should return true if compare succeeds', async () => {
      const sut = makeSut()
      const res = await sut.compare('any_value', 'any_hash')
      expect(res).toBe(true)
    })

    it('should return false if compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
      const res = await sut.compare('invalid_value', 'any_hash')
      expect(res).toBe(false)
    })

    it('should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const res = sut.compare('any_value', 'any_hash')
      await expect(res).rejects.toThrow()
    })
  })
})
