import {
  loginParamsSchema,
  accountSchema,
  errorSchema,
  signUpParamsSchema,
  addDeckParamsSchema,
  addFlashcardParamsSchema,
  deckSchema,
  flashcardSchema,
  decksSchema
} from './schemas/'

export default {
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  addDeckParams: addDeckParamsSchema,
  addFlashcardParams: addFlashcardParamsSchema,
  account: accountSchema,
  deck: deckSchema,
  decks: decksSchema,
  flashcard: flashcardSchema,
  error: errorSchema
}
