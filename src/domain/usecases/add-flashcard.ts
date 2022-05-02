import { Flashcard } from '@/domain/models'

export interface AddFlashcard {
  add: (params: AddFlashcard.Params) => Promise<AddFlashcard.Result>
}

export namespace AddFlashcard {
  export type Params = {
    ownerId: string
    deckId: string
    flashcard: Flashcard
  }
  export type Result = boolean
}
