import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Memolang API',
    version: '0.0.2'
  },
  servers: [
    {
      url: '/api',
      description: 'Main Server'
    }
  ],
  tags: [
    {
      name: 'Accounts',
      description: 'Account related APIs'
    },
    {
      name: 'Decks',
      description: 'Deck related APIs'
    }
  ],
  paths,
  schemas,
  components
}
