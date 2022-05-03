import { DeckModel } from '@/domain/models'

export interface LoadDecksRepository {
  load: (ownerId: string) => Promise<LoadDecksRepository.Result>
}

export namespace LoadDecksRepository {
  export type Result = DeckModel[]
}
