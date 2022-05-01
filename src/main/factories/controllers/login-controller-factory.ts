import { Controller } from '@/presentation/contracts'
import { LoginController } from '@/presentation/controllers'
import { makeDbAuthentication, makeLoginValidation } from '@/main/factories'

export const makeLoginController = (): Controller => {
  return new LoginController(makeLoginValidation(), makeDbAuthentication())
}
