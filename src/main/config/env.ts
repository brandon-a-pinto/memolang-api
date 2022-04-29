export default {
  mongo_url: process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/api',
  port: process.env.PORT ?? 8000,
  jwtSecret: process.env.JWT_SECRET ?? '9493393e990ff8a4b5f88c68f2e23d16'
}
