import { AddDeck } from '@/domain/usecases'

export class AddDeckMock implements AddDeck {
  params: AddDeck.Params

  async add(params: AddDeck.Params): Promise<AddDeck.Result> {
    this.params = params
  }
}
