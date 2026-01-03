const stripe = require("../config/stripe");
const Usage = require("../modules/billing/usage.model");
const Subscription = require("../modules/billing/subscription.model");

exports.reportUsage = async () => {
  const subs = await Subscription.find({ status: "active" });

  for (const sub of subs) {
    const total = await Usage.aggregate([
      { $match: { orgId: sub.orgId } },
      { $group: { _id: null, sum: { $sum: "$quantity" } } }
    ]);

    if (!total.length) continue;

    await stripe.subscriptionItems.createUsageRecord(
      sub.stripeSubscriptionItemId,
      {
        quantity: total[0].sum,
        timestamp: Math.floor(Date.now() / 1000)
      }
    );

    await Usage.deleteMany({ orgId: sub.orgId });
  }
};
