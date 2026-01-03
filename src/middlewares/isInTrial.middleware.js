const isInTrial = sub.trialEndsAt && Date.now() < sub.trialEndsAt;

if (sub.status !== "active" && !isInTrial) {
  return res.status(403).json({ message: "Subscription required" });
}

if (!isInTrial && requiredPlan && sub.plan !== requiredPlan) {
  return res.status(403).json({ message: "Upgrade required" });
}
