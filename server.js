require("dotenv").config(); // 🔥 MUST be first

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");

// ENV check (optional)
console.log("ENV CHECK:", {
  BASE_URL: process.env.BASE_URL,
  MONGO_URI: !!process.env.MONGO_URI,
  REDIS_URL: !!process.env.REDIS_URL
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
 console.log("Calling connectRedis...");
  // 🔥 Redis connects AFTER server starts
  await connectRedis();
  console.log("connectRedis() finished");

});
