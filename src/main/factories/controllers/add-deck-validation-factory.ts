import { Validation } from '@/presentation/contracts'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

export const makeAddDeckValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['title', 'language']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
