import faker from '@faker-js/faker'

import {
  AddAccount,
  Authentication,
  LoadAccountByToken
} from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result = true

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result = {
    accessToken: faker.datatype.uuid()
  }

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  token: string
  role: string
  result = {
    id: faker.datatype.uuid()
  }

  async load(token: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.token = token
    this.role = role
    return this.result
  }
}
