import faker from '@faker-js/faker'

import { AddDeck } from '@/domain/usecases'

export const mockAddDeckParams = (): AddDeck.Params => ({
  ownerId: faker.datatype.uuid(),
  title: faker.random.words(),
  language: faker.random.word()
})
