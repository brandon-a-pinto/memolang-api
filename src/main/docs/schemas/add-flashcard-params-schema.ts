export const addFlashcardParamsSchema = {
  type: 'object',
  properties: {
    front: {
      type: 'object',
      properties: {
        content: {
          type: 'string'
        },
        howToRead: {
          type: 'string',
          required: false
        }
      }
    },
    back: {
      type: 'object',
      properties: {
        content: {
          type: 'string'
        },
        glossary: {
          type: 'object',
          required: false,
          properties: {
            words: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            meanings: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },
  required: ['front', 'back']
}
