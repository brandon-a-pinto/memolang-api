import { Front, Back } from '@/domain/models'

export interface AddFlashcard {
  add: (params: AddFlashcard.Params) => Promise<AddFlashcard.Result>
}

export namespace AddFlashcard {
  export type Params = {
    ownerId: string
    deckId: string
    front: Front
    back: Back
  }
  export type Result = boolean
}
