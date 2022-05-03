import { AddDeckRepository, AddFlashcardRepository } from '@/data/contracts'
import { MongoHelper } from '@/infra/db'
import { ObjectId } from 'mongodb'

export class DeckMongoRepository
  implements AddDeckRepository, AddFlashcardRepository
{
  async add(
    params: AddDeckRepository.Params
  ): Promise<AddDeckRepository.Result> {
    const deckCollection = MongoHelper.getCollection('decks')
    await deckCollection.insertOne(params)
  }

  async addFlashcard(
    params: AddFlashcardRepository.Params
  ): Promise<AddFlashcardRepository.Result> {
    const { deckId, flashcard } = params
    const deckCollection = MongoHelper.getCollection('decks')
    const result = await deckCollection.updateOne(
      { _id: new ObjectId(deckId) },
      { $addToSet: { flashcards: flashcard } }
    )
    return result.acknowledged !== null
  }
}
