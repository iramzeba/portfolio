const { createClient } = require("redis");
const logger = require("../middlewares/logger.middleware");

let redis = null;

async function connectRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl || !redisUrl.startsWith("redis://")) {
    logger.warn("Redis disabled (REDIS_URL not set or invalid)");
    return null;
  }

  redis = createClient({ url: redisUrl });

  redis.on("connect", () => logger.info("Redis connected"));
  redis.on("error", (err) => logger.error("Redis error", err.message));

  try {
    await redis.connect();
  } catch (err) {
    logger.error("Redis connection failed", err.message);
  }

  return redis;
}

module.exports = { connectRedis };
