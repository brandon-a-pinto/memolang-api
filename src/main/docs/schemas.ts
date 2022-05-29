import {
  loginParamsSchema,
  accountSchema,
  errorSchema,
  signUpParamsSchema
} from './schemas/'

export default {
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  account: accountSchema,
  error: errorSchema
}
