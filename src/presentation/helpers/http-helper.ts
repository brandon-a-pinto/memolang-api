import { HttpResponse } from '@/presentation/contracts'
import { ServerError, UnauthorizedError } from '@/presentation/errors'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const badRequest = (data: any): HttpResponse => ({
  statusCode: 400,
  body: data
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (err: Error): HttpResponse => ({
  statusCode: 403,
  body: err
})

export const serverError = (err: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(err.stack)
})
