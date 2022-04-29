import validator from 'validator'
import faker from '@faker-js/faker'

import { EmailValidatorAdapter } from '@/infra/validators'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const res = sut.isValid('invalid_email')
    expect(res).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = makeSut()
    const res = sut.isValid(faker.internet.email())
    expect(res).toEqual(true)
  })

  it('should call validator with correct email', async () => {
    const email = faker.internet.email()
    const sut = makeSut()
    const isEmail = jest.spyOn(validator, 'isEmail')
    sut.isValid(email)
    expect(isEmail).toHaveBeenCalledWith(email)
  })
})
