import { Controller } from '@/presentation/contracts'
import { AddDeckController } from '@/presentation/controllers'
import { makeDbAddDeck, makeAddDeckValidation } from '@/main/factories'

export const makeAddDeckController = (): Controller => {
  return new AddDeckController(makeAddDeckValidation(), makeDbAddDeck())
}
