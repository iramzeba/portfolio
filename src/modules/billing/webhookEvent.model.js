const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    required: true
  },
  type: String,
  processedAt: {
    type: Date,
    default: Date.now
  }
});

webhookEventSchema.index({ eventId: 1 }, { unique: true });

module.exports = mongoose.model("WebhookEvent", webhookEventSchema);
