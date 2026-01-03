const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, index: true },
  metric: {
    type: String,
    enum: ["api_calls", "projects", "tasks"]
  },
  quantity: Number,
    reported: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Usage", usageSchema);
