import { Middleware, HttpResponse } from '@/presentation/contracts'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByToken } from '@/domain/usecases'
import { forbidden, ok, serverError } from '@/presentation/helpers'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async perform(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
