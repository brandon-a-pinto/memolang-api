import faker from '@faker-js/faker'

import {
  AddDeckRepository,
  CheckDeckByOwnerIdRepository,
  AddFlashcardRepository,
  LoadDecksRepository
} from '@/data/contracts'

export class AddDeckRepositoryMock implements AddDeckRepository {
  params: AddDeckRepository.Params

  async add(data: AddDeckRepository.Params): Promise<AddDeckRepository.Result> {
    this.params = data
  }
}

export class CheckDeckByOwnerIdRepositorySpy
  implements CheckDeckByOwnerIdRepository
{
  deckId: string
  ownerId: string
  result: boolean = true

  async checkByOwnerId(ownerId: string, deckId: string): Promise<boolean> {
    this.ownerId = ownerId
    this.deckId = deckId
    return this.result
  }
}

export class AddFlashcardRepositorySpy implements AddFlashcardRepository {
  params: AddFlashcardRepository.Params
  result: boolean = true

  async addFlashcard(params: AddFlashcardRepository.Params): Promise<boolean> {
    this.params = params
    return this.result
  }
}

export class LoadDecksRepositorySpy implements LoadDecksRepository {
  ownerId: string
  result = [
    {
      id: faker.datatype.uuid(),
      title: faker.random.words(),
      language: faker.random.words(),
      ownerId: faker.datatype.uuid()
    }
  ]

  async load(ownerId: string): Promise<LoadDecksRepository.Result> {
    this.ownerId = ownerId
    return this.result
  }
}
