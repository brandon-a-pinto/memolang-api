import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite
} from '@/validation/validators'
import { Validation } from '@/presentation/contracts'
import { makeLoginValidation } from '@/main/factories/controllers'
import { EmailValidatorAdapter } from '@/infra/validators'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
