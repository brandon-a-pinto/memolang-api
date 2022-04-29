import faker from '@faker-js/faker'

import { AddAccount } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccount.Params => ({
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password()
})
