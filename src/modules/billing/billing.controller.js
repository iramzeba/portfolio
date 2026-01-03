const stripe = require("../../config/stripe");
const Subscription = require("./subscription.model");
const logger = require("../../middlewares/logger.middleware")
const { reportUsageForOrg } = require("./reportUsage.service");
const Usage = require("./usage.model");

const redis = require("../../config/redis");
exports.createCheckoutSession = async (req, res) => {
  
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
console.log("👉 CHECKOUT ORG ID:", req.orgId);
 const session = await stripe.checkout.sessions.create({
  mode: "subscription",

  customer_email: req.user.email,

  line_items: [
    {
      price: process.env.STRIPE_PRO_PRICE_ID,
      quantity: 1
    }
  ],

  metadata: {
    orgId: req.orgId,          // ⭐ REQUIRED
    userId: req.user._id
  },

  subscription_data: {
    metadata: {
      orgId: req.orgId         // ⭐ ALSO ADD HERE
    }
  },

  success_url: `${process.env.BASE_URL}/billing/success`,
  cancel_url: `${process.env.BASE_URL}/billing/cancel`
});


  res.json({ url: session.url,
   message: " successful"
  });
};

exports.successPage = (req, res) => {
  res.json({
    success: true,
    message: "Payment successful. Your subscription is being processed."
  });
};


// billing.controller.js
exports.createBillingPortalSession = async (req, res) => {
  const subscription = await Subscription.findOne({ orgId: req.orgId });
  if (!subscription) return res.status(404).json({ message: "No active subscription" });

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/billing`
  });
  logger.info("Billing portal session created for orgId: %s", req.orgId);
  res.json({ url: session.url });
};


exports.CancelPage = async(req,res)=>{
  res.json({
    success:false,
    message:"Payment Failed"
  })
}






exports.reportUsage = async (req, res) => {
  const orgId = req.orgId;

  if (!orgId) {
    logger.warn("Missing orgId in reportUsage", { path: req.originalUrl });
    return res.status(400).json({
      success: false,
      message: "orgId is required"
    });
  }

  const redisKey = `usage_reported:${orgId}:projects`;

  try {
    // Optional: prevent duplicate usage report in short time
    const exists = await redis.get(redisKey);
    if (exists) {
      logger.warn("Duplicate usage report attempt", { orgId });
      return res.status(429).json({
        success: false,
        message: "Usage already reported recently"
      });
    }

    // Mark usage in Redis for 60s to prevent duplicates
    await redis.setEx(redisKey, 60, "1");

    // Save usage to DB
    const usage = await Usage.create({
      orgId,
      metric: "projects",
      quantity: 1
    });

    logger.info("Usage reported", { orgId, usageId: usage._id });

    res.json({ success: true, usageId: usage._id });
  } catch (err) {
    logger.error("Failed to report usage", { orgId, error: err });
    res.status(500).json({
      success: false,
      message: "Failed to report usage",
     
    });
  }
};
