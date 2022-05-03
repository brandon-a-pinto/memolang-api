import { DbAddFlashcard } from '@/data/usecases'
import { AddFlashcard } from '@/domain/usecases'
import { DeckMongoRepository } from '@/infra/db'

export const makeDbAddFlashcard = (): AddFlashcard => {
  const deckMongoRepository = new DeckMongoRepository()
  return new DbAddFlashcard(deckMongoRepository, deckMongoRepository)
}
