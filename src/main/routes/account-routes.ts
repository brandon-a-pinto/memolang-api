import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeSignUpController, makeLoginController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/accounts/signup', adaptRoute(makeSignUpController()))
  router.post('/accounts/login', adaptRoute(makeLoginController()))
}
