const Redis = require('ioredis');

let client = null;

function getRedisClient() {
  if (!client) {
    client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3
    });
    client.on('error', (err) => console.warn('Redis error:', err.message));
    client.on('connect', () => console.log('Redis connected'));
  }
  return client;
}

const TTL = parseInt(process.env.REDIS_TTL || '300');

async function cacheGet(key) {
  try {
    const data = await getRedisClient().get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

async function cacheSet(key, value, ttl = TTL) {
  try {
    await getRedisClient().setex(key, ttl, JSON.stringify(value));
  } catch {}
}

async function cacheDel(key) {
  try { await getRedisClient().del(key); } catch {}
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel, TTL };
