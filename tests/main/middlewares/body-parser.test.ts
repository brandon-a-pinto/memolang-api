import { Express } from 'express'
import request from 'supertest'

import { setupApp } from '@/main/config/app'

let app: Express

describe('BodyParser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      return res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ test: 'body_parser' })
      .expect({ test: 'body_parser' })
  })
})
