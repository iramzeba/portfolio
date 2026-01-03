const { createClient } = require("redis");
const logger = require("../middlewares/logger.middleware");

let redis = null;

const redisUrl = process.env.REDIS_URL;

// Only connect if a REAL Redis URL exists
if (redisUrl && redisUrl.startsWith("redis://")) {
  redis = createClient({ url: redisUrl });

  redis.on("connect", () => logger.info("Redis connected"));
  redis.on("error", (err) => logger.error("Redis error", err.message));

  (async () => {
    try {
      await redis.connect();
    } catch (err) {
      logger.error("Redis connection failed", err.message);
    }
  })();
} else {
  logger.warn("Redis disabled (REDIS_URL not set or invalid)");
}

module.exports = redis;
