import faker from '@faker-js/faker'

import { DeckModel } from '@/domain/models'
import { AddDeck, AddFlashcard, LoadDecks } from '@/domain/usecases'

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

export class LoadDecksSpy implements LoadDecks {
  ownerId: string
  result = [
    {
      id: faker.datatype.uuid(),
      title: faker.random.words(),
      language: faker.random.words(),
      ownerId: faker.datatype.uuid()
    }
  ]

  async load(ownerId: string): Promise<DeckModel[]> {
    this.ownerId = ownerId
    return this.result
  }
}
