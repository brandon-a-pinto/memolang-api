import { Express } from 'express'
import request from 'supertest'

import { setupApp } from '@/main/config/app'

let app: Express

describe('CORS Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('should enable CORS', async () => {
    app.get('/test_cors', (_req, res) => {
      return res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
