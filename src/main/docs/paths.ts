import { loginPath, signUpPath, deckPath, addFlashcardPath } from './paths/'

export default {
  '/accounts/signup': signUpPath,
  '/accounts/login': loginPath,
  '/decks': deckPath,
  '/decks/{deckId}/add-card': addFlashcardPath
}
