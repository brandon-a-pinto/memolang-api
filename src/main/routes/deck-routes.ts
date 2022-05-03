import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import {
  makeAddDeckController,
  makeAddFlashcardController
} from '@/main/factories'
import { auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/decks', auth, adaptRoute(makeAddDeckController()))
  router.put(
    '/decks/:deckId/add-card',
    auth,
    adaptRoute(makeAddFlashcardController())
  )
}
