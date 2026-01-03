const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  status: String,
  trialEndsAt: {
  type: Date
}
}, { timestamps: true });

subscriptionSchema.index({orgId:1})

module.exports = mongoose.model("Subscription", subscriptionSchema);
