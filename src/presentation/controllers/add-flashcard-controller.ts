import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { AddFlashcard } from '@/domain/usecases'
import { InvalidUserError } from '@/presentation/errors'
import {
  noContent,
  badRequest,
  serverError,
  forbidden
} from '@/presentation/helpers'

export class AddFlashcardController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addFlashcard: AddFlashcard
  ) {}

  async perform(
    request: AddFlashcardController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { accountId, deckId, front, back } = request
      const card = await this.addFlashcard.add({
        front,
        back,
        deckId,
        ownerId: accountId
      })
      if (!card) {
        return forbidden(new InvalidUserError())
      }
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AddFlashcardController {
  export type Request = {
    accountId: string
    deckId: string
    front: Front
    back: Back
  }
  type Front = {
    content: string
    howToRead?: string
  }
  type Back = {
    content: string
    glossary?: {
      words: string[]
      meanings: string[]
    }
  }
}
