export const addDeckParamsSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    language: {
      type: 'string'
    }
  },
  required: ['title', 'language']
}
