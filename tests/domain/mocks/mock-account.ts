import faker from '@faker-js/faker'

import { AddAccount, Authentication } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccount.Params => ({
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
