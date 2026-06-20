const Redis = require('ioredis');

let client = null;
let redisAvailable = false;

function getRedisClient() {
  if (!client) {
    const redisOpts = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Redis unavailable after 3 retries — running without cache');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      lazyConnect: true
    };
    if (process.env.REDIS_PASSWORD) {
      redisOpts.password = process.env.REDIS_PASSWORD;
    }
    client = new Redis(redisOpts);
    client.on('error', () => { redisAvailable = false; });
    client.on('connect', () => { redisAvailable = true; console.log('Redis connected'); });
    client.connect().catch(() => {
      console.warn('Redis not available — running without cache');
    });
  }
  return client;
}

const TTL = parseInt(process.env.REDIS_TTL || '300');

async function cacheGet(key) {
  if (!redisAvailable) return null;
  try {
    const data = await getRedisClient().get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

async function cacheSet(key, value, ttl = TTL) {
  if (!redisAvailable) return;
  try {
    await getRedisClient().setex(key, ttl, JSON.stringify(value));
  } catch {}
}

async function cacheDel(key) {
  if (!redisAvailable) return;
  try { await getRedisClient().del(key); } catch {}
}

async function clearLeaderboardCache() {
  if (!redisAvailable) return;
  try {
    const redis = getRedisClient();
    const keys = await redis.keys('leaderboard:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    console.warn('Failed to clear leaderboard cache:', err.message);
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel, clearLeaderboardCache, TTL };

