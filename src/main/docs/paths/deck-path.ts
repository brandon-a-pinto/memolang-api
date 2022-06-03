export const deckPath = {
  post: {
    tags: ['Decks'],
    summary: 'Add deck API',
    description: 'This route can only be executed by authenticated users',
    security: [
      {
        apiKeyAuth: []
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addDeckParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success, but no content'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  get: {
    tags: ['Decks'],
    summary: 'Load decks API',
    description: 'This route can only be executed by authenticated users',
    security: [
      {
        apiKeyAuth: []
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/decks'
            }
          }
        }
      },
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
