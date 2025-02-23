import { LoadAccountByToken } from '@/domain/usecases'
import { Decrypter, LoadAccountByTokenRepository } from '@/data/contracts'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(token: string, role?: string): Promise<LoadAccountByToken.Result> {
    let accountToken: string
    try {
      accountToken = await this.decrypter.decrypt(token)
    } catch (error) {
      return null
    }
    if (accountToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        token,
        role
      )
      if (account) {
        return account
      }
    }
    return null
  }
}
