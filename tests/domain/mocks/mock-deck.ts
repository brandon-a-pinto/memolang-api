import faker from '@faker-js/faker'

import { AddDeck, AddFlashcard } from '@/domain/usecases'

export const mockAddDeckParams = (): AddDeck.Params => ({
  ownerId: faker.datatype.uuid(),
  title: faker.random.words(),
  language: faker.random.word()
})

export const mockAddFlashcardParams = (): AddFlashcard.Params => ({
  ownerId: faker.datatype.uuid(),
  deckId: faker.datatype.uuid(),
  flashcard: {
    front: {
      content: faker.random.words(),
      howToRead: faker.random.words()
    },
    back: {
      content: faker.random.words(),
      glossary: {
        words: [faker.random.word()],
        meanings: [faker.random.word()]
      }
    }
  }
})
