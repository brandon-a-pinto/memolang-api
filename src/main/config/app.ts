import express, { Express } from 'express'

import setupApolloServer from '@/main/config/apollo-server'
import setupSwagger from '@/main/config/swagger'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupApolloServer(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  return app
}
