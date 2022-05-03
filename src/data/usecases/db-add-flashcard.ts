import { AddFlashcard } from '@/domain/usecases'
import { CheckDeckByOwnerIdRepository } from '@/data/contracts'

export class DbAddFlashcard implements AddFlashcard {
  constructor(
    private readonly checkDeckByOwnerIdRepository: CheckDeckByOwnerIdRepository
  ) {}

  async add(params: AddFlashcard.Params): Promise<AddFlashcard.Result> {
    const { deckId, ownerId } = params
    await this.checkDeckByOwnerIdRepository.checkByOwnerId(ownerId, deckId)
    return false
  }
}
