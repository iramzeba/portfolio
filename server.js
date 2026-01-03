console.log("ENV CHECK:", {
  BASE_URL: process.env.BASE_URL,
  MONGO_URI: !!process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL
});



require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
