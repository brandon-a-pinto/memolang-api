import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeSignUpController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/accounts/signup', adaptRoute(makeSignUpController()))
}
