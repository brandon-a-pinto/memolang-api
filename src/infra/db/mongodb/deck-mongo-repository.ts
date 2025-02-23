import {
  AddDeckRepository,
  AddFlashcardRepository,
  CheckDeckByOwnerIdRepository,
  LoadDecksRepository
} from '@/data/contracts'
import { MongoHelper, QueryBuilder } from '@/infra/db'
import { ObjectId } from 'mongodb'

export class DeckMongoRepository
  implements
    AddDeckRepository,
    AddFlashcardRepository,
    CheckDeckByOwnerIdRepository,
    LoadDecksRepository
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

  async load(ownerId: string): Promise<LoadDecksRepository.Result> {
    const deckCollection = MongoHelper.getCollection('decks')
    const query = new QueryBuilder()
      .match({ ownerId: new ObjectId(ownerId) })
      .project({ _id: 1, title: 1, language: 1, ownerId: 1, flashcards: 1 })
      .build()
    const result = await deckCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection(result)
  }
}
