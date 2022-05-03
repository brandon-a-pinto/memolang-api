export type DeckModel = {
  id: string
  title: string
  language: string
  ownerId: string
  flashcards?: [
    {
      front: Front
      back: Back
    }
  ]
}

export type Front = {
  content: string
  howToRead?: string
}

export type Back = {
  content: string
  glossary?: {
    words: string[]
    meanings: string[]
  }
}
