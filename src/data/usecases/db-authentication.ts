import { Authentication } from '@/domain/usecases'
import {
  LoadAccountByEmailRepository,
  HasherComparer,
  Encrypter,
  UpdateTokenRepository
} from '@/data/contracts'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) {}

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      params.email
    )
    if (account) {
      const isValid = await this.hasherComparer.compare(
        params.password,
        account.password
      )
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateTokenRepository.updateToken(account.id, accessToken)
        return { accessToken }
      }
    }
    return null
  }
}
