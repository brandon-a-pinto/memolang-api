import { DeckModel } from '@/domain/models'

export interface LoadDecks {
  load: (ownerId: string) => Promise<DeckModel[]>
}
