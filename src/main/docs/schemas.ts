import {
  loginParamsSchema,
  accountSchema,
  errorSchema,
  signUpParamsSchema,
  addDeckParamsSchema,
  addFlashcardParamsSchema
} from './schemas/'

export default {
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  addDeckParams: addDeckParamsSchema,
  addFlashcardParams: addFlashcardParamsSchema,
  account: accountSchema,
  error: errorSchema
}
