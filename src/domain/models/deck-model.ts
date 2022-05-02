export type DeckModel = {
  id: string
  title: string
  language: string
  ownerId: string
  flashcards?: Flashcard[]
}

export type Flashcard = {
  front: {
    content: string
    howToRead?: string
  }
  back: {
    content: string
    glossary?: {
      words: string[]
      meanings: string[]
    }
  }
}
