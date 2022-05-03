import { Validation } from '@/presentation/contracts'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

export const makeAddFlashcardValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['flashcard']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
