import {
  AddDeckRepository,
  AddFlashcardRepository,
  CheckDeckByOwnerIdRepository
} from '@/data/contracts'
import { MongoHelper } from '@/infra/db'
import { ObjectId } from 'mongodb'

export class DeckMongoRepository
  implements
    AddDeckRepository,
    AddFlashcardRepository,
    CheckDeckByOwnerIdRepository
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
    const { deckId, front, back } = params
    const deckCollection = MongoHelper.getCollection('decks')
    const result = await deckCollection.updateOne(
      { _id: new ObjectId(deckId) },
      { $addToSet: { flashcards: { front, back } } }
    )
    return result.acknowledged !== null
  }

  async checkByOwnerId(ownerId: string, deckId: string): Promise<boolean> {
    const deckCollection = MongoHelper.getCollection('decks')
    const result = await deckCollection.findOne(
      {
        _id: new ObjectId(deckId),
        ownerId: new ObjectId(ownerId)
      },
      { projection: { _id: 1, ownerId: 1 } }
    )
    return result !== null
  }
}
