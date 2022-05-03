import { Controller } from '@/presentation/contracts'
import { AddFlashcardController } from '@/presentation/controllers'
import {
  makeDbAddFlashcard,
  makeAddFlashcardValidation
} from '@/main/factories'

export const makeAddFlashcardController = (): Controller => {
  return new AddFlashcardController(
    makeAddFlashcardValidation(),
    makeDbAddFlashcard()
  )
}
