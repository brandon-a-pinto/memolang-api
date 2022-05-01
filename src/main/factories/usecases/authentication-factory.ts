import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import env from '@/main/config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
