import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { noContent, badRequest, serverError } from '@/presentation/helpers'

export class AddDeckController implements Controller {
  constructor(private readonly validation: Validation) {}

  async perform(request: AddDeckController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AddDeckController {
  export type Request = {
    title: string
    language: string
  }
}
