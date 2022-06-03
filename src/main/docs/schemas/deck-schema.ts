export const deckSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    isPublic: {
      type: 'boolean'
    },
    ownerId: {
      type: 'string'
    },
    flashcards: {
      type: 'array',
      items: {
        $ref: '#/schemas/flashcard'
      }
    }
  },
  required: ['title', 'language', 'ownerId']
}
