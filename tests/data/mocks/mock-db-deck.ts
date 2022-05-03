import {
  AddDeckRepository,
  CheckDeckByOwnerIdRepository
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
