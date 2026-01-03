const Subscription = require("../modules/billing/subscription.model");
const Org = require("../modules/org/org.model")


module.exports = (requiredPlan) => async (req, res, next) => {
  const sub = await Subscription.findOne({ orgId: req.orgId });

  const TRIAL_DAYS = 15;

  // 🔹 CASE 1: No subscription yet → check trial
  if (!sub) {
    // You MUST have org createdAt
    const org = await Org.findById(req.orgId);

    if (!org) {
      return res.status(403).json({ message: "Organization not found" });
    }

    const trialEndsAt = new Date(
      org.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
    );

    const isInTrial = Date.now() < trialEndsAt;

    if (!isInTrial) {
      return res.status(403).json({ message: "Subscription required" });
    }

    // ✅ Allow access during trial
    req.isInTrial = true;
    return next();
  }

  // 🔹 CASE 2: Subscription exists
  const isInTrial =
    sub.createdAt &&
    Date.now() <
      new Date(sub.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  if (sub.status !== "active" && !isInTrial) {
    return res.status(403).json({ message: "Subscription expired" });
  }

  if (!isInTrial && requiredPlan && sub.plan !== requiredPlan) {
    return res.status(403).json({ message: "Upgrade required" });
  }

  req.subscription = sub;
  req.isInTrial = isInTrial;

  next();
};
