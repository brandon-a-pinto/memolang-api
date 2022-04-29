import { HttpResponse } from '@/presentation/contracts'

export interface Controller<T = any> {
  perform: (request: T) => Promise<HttpResponse>
}
