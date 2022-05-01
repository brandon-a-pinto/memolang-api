import jwt from 'jsonwebtoken'

import { JwtAdapter } from '@/infra/cryptography'
import { throwError } from '@/tests/domain/mocks'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token'
  },

  async verify(): Promise<string> {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('any_secret')

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret')
    })

    it('should return a token on sign success', async () => {
      const sut = makeSut()
      const res = await sut.encrypt('any_id')
      expect(res).toBe('any_token')
    })

    it('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
      const res = sut.encrypt('invalid_id')
      await expect(res).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'any_secret')
    })

    it('should return a value on verify success', async () => {
      const sut = makeSut()
      const res = await sut.decrypt('any_token')
      expect(res).toBe('any_value')
    })

    it('should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)
      const res = sut.decrypt('any_token')
      await expect(res).rejects.toThrow()
    })
  })
})
