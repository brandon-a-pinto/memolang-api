import faker from '@faker-js/faker'

import { CompareFieldsValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFields Validation', () => {
  it('should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const res = sut.validate({
      [field]: 'any_field',
      [fieldToCompare]: 'invalid_field'
    })
    expect(res).toEqual(new InvalidParamError(fieldToCompare))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const res = sut.validate({
      [field]: 'any_field',
      [fieldToCompare]: 'any_field'
    })
    expect(res).toBeFalsy()
  })
})
