const redis = require('../config/redis')
const crypto  = require("crypto")
const logger = require("./logger.middleware")


const cache = (ttlSeconds = 60) => {
 
  return async (req, res, next) => {
      console.log("Cache middleware invoked for:", req.originalUrl);
    // Cache only GET
    if (req.method !== "GET") return next();

    // Redis not ready → skip cache
  if (!redis.isOpen) {
    console.log("Redis not ready, skipping cache");
    return next();
  }

    try {
      console.time("total request");
      const orgId = req.orgId || "public";

      const queryHash = crypto
        .createHash("md5")
        .update(JSON.stringify(req.query))
        .digest("hex");

      const cacheKey = `cache:${orgId}:${req.method}:${req.originalUrl}:${queryHash}`;

      // 🔍 Check cache
      console.time("cache get");
      const cached = await redis.get(cacheKey);
       console.timeEnd("cache get");
      if (cached) {
         console.log("CACHE HIT");
        logger.info("Cache HIT", { cacheKey, orgId });
        console.timeEnd("total request");
        res.set("X-Cache", "HIT");
        return res.json(JSON.parse(cached));
      } 
console.log("CACHE MISS");

console.time("db query");
      logger.info("Cache MISS", { cacheKey, orgId });

      // 🎯 Hook response
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.setEx(cacheKey, ttlSeconds, JSON.stringify(body));
          logger.debug("Cache SET", { cacheKey, ttlSeconds });
        }

        res.set("X-Cache", "MISS");
        return originalJson(body);
      };

      next();
    } catch (err) {
       console.error("Cache middleware error", err);
      logger.error("Cache middleware error", err);
      next(); // fail-open
    }
  };
};

module.exports = cache;
