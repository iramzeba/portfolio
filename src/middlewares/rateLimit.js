const logger = require("./logger.middleware");

const redis = require("../config/redis");


const rateLimit = ({
  windowSeconds = 60,
  maxRequests = 100,
  keyPrefix = "rl",
} = {}) => {
  return async (req, res, next) => {
    try {
      const identifier =
        req.user?.userId ||
        req.orgId ||
        req.ip;

      const key = `${keyPrefix}:${identifier}`;

      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (count > maxRequests) {
        logger.warn("Rate limit exceeded", {
          key,
          identifier,
          ip: req.ip,
          path: req.originalUrl,
        });

        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      res.set({
        "X-RateLimit-Limit": maxRequests,
        "X-RateLimit-Remaining": Math.max(0, maxRequests - count),
      });

      next();
    } catch (err) {
      logger.error("Rate limiter error", err);
      next();
    }
  };
};

module.exports = rateLimit;


module.exports = rateLimit;
