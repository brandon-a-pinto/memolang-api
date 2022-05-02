import { AddDeck, AddFlashcard } from '@/domain/usecases'

export class AddDeckMock implements AddDeck {
  params: AddDeck.Params

  async add(params: AddDeck.Params): Promise<AddDeck.Result> {
    this.params = params
  }
}

export class AddFlashcardSpy implements AddFlashcard {
  params: AddFlashcard.Params
  result: boolean = true

  async add(params: AddFlashcard.Params): Promise<boolean> {
    this.params = params
    return this.result
  }
}
