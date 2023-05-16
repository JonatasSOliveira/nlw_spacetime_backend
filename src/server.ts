import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

const app = fastify()
const prisma = new PrismaClient()

app.get('/users', async () => {
  return await prisma.user.findMany()
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port http://localhost:3333')
  })
