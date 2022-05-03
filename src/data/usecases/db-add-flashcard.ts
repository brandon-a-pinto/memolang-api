import { AddFlashcard } from '@/domain/usecases'
import {
  CheckDeckByOwnerIdRepository,
  AddFlashcardRepository
} from '@/data/contracts'

export class DbAddFlashcard implements AddFlashcard {
  constructor(
    private readonly checkDeckByOwnerIdRepository: CheckDeckByOwnerIdRepository,
    private readonly addFlashcardRepository: AddFlashcardRepository
  ) {}

  async add(params: AddFlashcard.Params): Promise<AddFlashcard.Result> {
    let isValid = false
    const check = await this.checkDeckByOwnerIdRepository.checkByOwnerId(
      params.ownerId,
      params.deckId
    )
    if (check) {
      isValid = await this.addFlashcardRepository.addFlashcard(params)
    }
    return isValid
  }
}
