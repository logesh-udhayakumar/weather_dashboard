import { Redis } from '@upstash/redis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

function createRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token || url.includes('YOUR_ENDPOINT') || !url.startsWith('http')) {
    console.warn('Redis credentials not configured. Caching will be disabled.')
    // Return a mock redis client that does nothing
    return {
      get: async () => null,
      set: async () => 'OK',
      setex: async () => 'OK',
      del: async () => 0,
      expire: async () => 0,
    } as unknown as Redis
  }

  return new Redis({ url, token })
}

export const redis = globalForRedis.redis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

export default redis
