import { EmailValidator } from '@/validation/contracts'

export class EmailValidatorSpy implements EmailValidator {
  email: string
  isEmailValid = true

  isValid(email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}
