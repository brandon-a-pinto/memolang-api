import { HttpResponse } from '@/presentation/contracts'

export interface Middleware<T = any> {
  perform: (request: T) => Promise<HttpResponse>
}
