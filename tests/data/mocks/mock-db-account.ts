import faker from '@faker-js/faker'

import {
  CheckAccountByEmailRepository,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateTokenRepository,
  LoadAccountByTokenRepository
} from '@/data/contracts'

export class CheckAccountByEmailRepositorySpy
  implements CheckAccountByEmailRepository
{
  email: string
  result = false

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result = true

  async add(
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  email: string
  result = {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password()
  }

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class UpdateTokenRepositoryMock implements UpdateTokenRepository {
  id: string
  token: string

  async updateToken(
    id: string,
    token: string
  ): Promise<UpdateTokenRepository.Result> {
    this.id = id
    this.token = token
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  token: string
  role: string
  result = {
    id: faker.datatype.uuid()
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return this.result
  }
}
