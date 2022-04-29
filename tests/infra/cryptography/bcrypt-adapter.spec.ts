import bcrypt from 'bcrypt'

import { BcryptAdapter } from '@/infra/cryptography'
import { throwError } from '@/tests/domain/mocks'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
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
})
