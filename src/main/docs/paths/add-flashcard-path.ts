export const addFlashcardPath = {
  put: {
    tags: ['Decks'],
    summary: 'Add flashcard API',
    description: 'This route can only be executed by authenticated users',
    security: [
      {
        apiKeyAuth: []
      }
    ],
    parameters: [
      {
        in: 'path',
        name: 'deckId',
        required: true,
        description: 'ID of a deck owned by the user',
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addFlashcardParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success, but no content'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
