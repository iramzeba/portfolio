const { createClient } = require("redis");
const logger = require("../middlewares/logger.middleware");

const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error("Redis error", err));

(async () => {
  await redis.connect();
})();

module.exports = redis;
