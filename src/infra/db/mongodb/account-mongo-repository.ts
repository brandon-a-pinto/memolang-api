import {
  AddAccountRepository,
  CheckAccountByEmailRepository
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
}
