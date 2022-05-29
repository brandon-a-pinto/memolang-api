import {
  loginParamsSchema,
  accountSchema,
  errorSchema,
  signUpParamsSchema,
  addDeckParamsSchema
} from './schemas/'

export default {
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  addDeckParams: addDeckParamsSchema,
  account: accountSchema,
  error: errorSchema
}
