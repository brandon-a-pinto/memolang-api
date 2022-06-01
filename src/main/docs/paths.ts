import { loginPath, signUpPath, addDeckPath, addFlashcardPath } from './paths/'

export default {
  '/accounts/signup': signUpPath,
  '/accounts/login': loginPath,
  '/decks': addDeckPath,
  '/decks/{deckId}/add-card': addFlashcardPath
}
