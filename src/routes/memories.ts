import { FastifyInstance } from 'fastify'
import { z } from "zod";

import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    return memories.map(memory => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat('...')
    }))
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)
    const memory = prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        content,
        isPublic,
        coverUrl,
        userId: ''
      }
    })

    return memory
  })

  app.put('/memories/:id', async () => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)
    await prisma.memory.delete({
      where: {
        id
      }
    })
  })
}
