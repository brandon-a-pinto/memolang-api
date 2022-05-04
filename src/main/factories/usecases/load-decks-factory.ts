import { DbLoadDecks } from '@/data/usecases'
import { DeckMongoRepository } from '@/infra/db'

export const makeDbLoadDecks = (): DbLoadDecks => {
  const deckMongoRepository = new DeckMongoRepository()
  return new DbLoadDecks(deckMongoRepository)
}
