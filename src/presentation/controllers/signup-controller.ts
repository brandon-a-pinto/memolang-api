import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { AddAccount, Authentication } from '@/domain/usecases'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError, forbidden } from '@/presentation/helpers'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async perform(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, username, password } = request
      const account = await this.addAccount.add({ email, username, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authentication = await this.authentication.auth({ email, password })
      return ok(authentication)
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    email: string
    username: string
    password: string
    passwordConfirmation: string
  }
}
