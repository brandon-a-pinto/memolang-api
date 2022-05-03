import { LoadDecks } from '@/domain/usecases'
import { LoadDecksRepository } from '@/data/contracts'
import { DeckModel } from '@/domain/models'

export class DbLoadDecks implements LoadDecks {
  constructor(private readonly loadDecksRepository: LoadDecksRepository) {}

  async load(ownerId: string): Promise<DeckModel[]> {
    const decks = await this.loadDecksRepository.load(ownerId)
    return decks
  }
}
