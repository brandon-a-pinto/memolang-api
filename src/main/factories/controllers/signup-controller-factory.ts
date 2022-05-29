import { Controller } from '@/presentation/contracts'
import { SignUpController } from '@/presentation/controllers'
import {
  makeDbAddAccount,
  makeSignUpValidation,
  makeDbAuthentication
} from '@/main/factories'

export const makeSignUpController = (): Controller => {
  return new SignUpController(
    makeSignUpValidation(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
}
