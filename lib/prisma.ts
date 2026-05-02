import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  _prismaClient: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma._prismaClient) {
    globalForPrisma._prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return globalForPrisma._prismaClient
}

/**
 * Lazy Proxy: defers `new PrismaClient()` until the first property access at
 * request-time. This prevents Vercel build failures caused by Prisma throwing
 * when DATABASE_URL is not set as a build-environment variable.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return (value as Function).bind(client)
    }
    return value
  },
})

export default prisma
