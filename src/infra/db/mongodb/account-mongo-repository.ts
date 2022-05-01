import { ObjectId } from 'mongodb'

import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateTokenRepository
} from '@/data/contracts'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository
  implements AddAccountRepository, CheckAccountByEmailRepository
{
  async add(
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(params)
    return result.insertedId !== null
  }

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1 } }
    )
    return account !== null
  }

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1, username: 1, password: 1 } }
    )
    return account && MongoHelper.map(account)
  }

  async updateToken(
    id: string,
    token: string
  ): Promise<UpdateTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      { accessToken: token, $or: [{ role }, { role: 'admin' }] },
      { projection: { _id: 1 } }
    )
    return account && MongoHelper.map(account)
  }
}
