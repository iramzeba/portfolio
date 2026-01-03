// auth/refreshToken.model.js
const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
