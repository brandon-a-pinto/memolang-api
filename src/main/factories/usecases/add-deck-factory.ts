import { DbAddDeck } from '@/data/usecases'
import { AddDeck } from '@/domain/usecases'
import { DeckMongoRepository } from '@/infra/db'

export const makeDbAddDeck = (): AddDeck => {
  const deckMongoRepository = new DeckMongoRepository()
  return new DbAddDeck(deckMongoRepository)
}
