import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { Authentication } from '@/domain/usecases'
import {
  ok,
  badRequest,
  unauthorized,
  serverError
} from '@/presentation/helpers'

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async perform(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const authentication = await this.authentication.auth(request)
      if (!authentication) {
        return unauthorized()
      }
      return ok(authentication)
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
