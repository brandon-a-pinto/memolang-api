import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
  forbidden
} from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  notFound,
  serverError,
  unauthorized,
  forbidden
}
