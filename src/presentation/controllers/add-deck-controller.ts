import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { AddDeck } from '@/domain/usecases'
import { noContent, badRequest, serverError } from '@/presentation/helpers'

export class AddDeckController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addDeck: AddDeck
  ) {}

  async perform(request: AddDeckController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      await this.addDeck.add(request)
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AddDeckController {
  export type Request = {
    accountId: string
    title: string
    language: string
  }
}
