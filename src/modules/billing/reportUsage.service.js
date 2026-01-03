// modules/billing/reportUsage.service.js
const stripe = require("../../config/stripe");
const Usage = require("./usage.model");
const Subscription = require("./subscription.model");
const logger = require("../../middlewares/logger.middleware");

exports.reportUsageForOrg = async (orgId) => {
  console.log("ORG ID:", req.orgId);
  // 1️⃣ Find active subscription
  const sub = await Subscription.findOne({
    orgId,
    status: "active"
  });

  if (!sub || !sub.stripeSubscriptionItemId) {
    logger.warn("No active usage subscription for orgId %s", orgId);
    return;
  }

  // 2️⃣ Aggregate unreported usage
  const usage = await Usage.aggregate([
    { $match: { orgId, reported: false } },
    {
      $group: {
        _id: "$metric",
        total: { $sum: "$quantity" }
      }
    }
  ]);

  if (!usage.length) {
    logger.info("No usage to report for orgId %s", orgId);
    return;
  }

  // 3️⃣ Report usage to Stripe
  for (const u of usage) {
    await stripe.subscriptionItems.createUsageRecord(
      sub.stripeSubscriptionItemId,
      {
        quantity: u.total,
        timestamp: Math.floor(Date.now() / 1000),
        action: "increment"
      }
    );
  }

  // 4️⃣ Mark usage as reported
  await Usage.updateMany(
    { orgId, reported: false },
    { $set: { reported: true } }
  );

  logger.info("✅ Usage reported successfully for orgId %s", orgId);
};
