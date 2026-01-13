const { createClient } = require("redis");
const logger = require("../middlewares/logger.middleware");

const redisUrl = process.env.REDIS_URL;

let redis;

if (redisUrl && redisUrl.startsWith("redis://")) {
  redis = createClient({ url: redisUrl });

  redis.on("connect", () => logger.info("🔌 Redis connecting..."));
  redis.on("ready", () => logger.info("✅ Redis ready"));
  redis.on("error", (err) => logger.error("❌ Redis error", err.message));
} else {
  logger.warn("⚠️ REDIS_URL missing — Redis disabled");
}

async function connectRedis() {
  if (!redis) return null;

  if (!redis.isOpen) {
    await redis.connect();
    logger.info("🚀 Redis connection established");
  }

  return redis;
}

module.exports = {
  redis,
  connectRedis,
};
