import { AddFlashcard } from '@/domain/usecases'

export interface AddFlashcardRepository {
  addFlashcard: (
    params: AddFlashcardRepository.Params
  ) => Promise<AddFlashcardRepository.Result>
}

export namespace AddFlashcardRepository {
  export type Params = AddFlashcard.Params
  export type Result = AddFlashcard.Result
}
