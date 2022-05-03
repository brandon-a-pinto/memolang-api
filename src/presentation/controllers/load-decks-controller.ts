import { Controller, HttpResponse } from '@/presentation/contracts'
import { LoadDecks } from '@/domain/usecases'
import { ok, noContent } from '@/presentation/helpers'

export class LoadDecksController implements Controller {
  constructor(private readonly loadDecks: LoadDecks) {}

  async perform(request: LoadDecksController.Request): Promise<HttpResponse> {
    const decks = await this.loadDecks.load(request.accountId)
    return decks.length ? ok(decks) : noContent()
  }
}

export namespace LoadDecksController {
  export type Request = {
    accountId: string
  }
}
