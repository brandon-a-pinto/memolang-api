import { Controller, HttpResponse, Validation } from '@/presentation/contracts'
import { AddFlashcard } from '@/domain/usecases'
import { noContent, badRequest, serverError } from '@/presentation/helpers'

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
      const { accountId, deckId, flashcard } = request
      await this.addFlashcard.add({
        flashcard,
        deckId,
        ownerId: accountId
      })
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
    flashcard: {
      front: Front
      back: Back
    }
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
