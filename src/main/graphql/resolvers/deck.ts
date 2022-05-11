import { adaptResolver } from '@/main/adapters'
import { makeLoadDecksController } from '@/main/factories'

export default {
  Query: {
    loadAll: async (_parent: any, args: any, context: any) =>
      adaptResolver(makeLoadDecksController(), args, context)
  }
}
