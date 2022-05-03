import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'
import { Validation } from '@/presentation/contracts'
import { makeAddFlashcardValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('AddFlashcardValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddFlashcardValidation()
    const validations: Validation[] = []
    for (const field of ['front', 'back']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
