import faker from '@faker-js/faker'

import { RequiredFieldValidation } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'

const field = faker.random.word()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ invalid: faker.random.word() })
    expect(error).toEqual(new MissingParamError(field))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
