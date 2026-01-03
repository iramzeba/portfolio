const stripe = require("../../config/stripe");
const Subscription = require("./subscription.model");
const logger = require("../../middlewares/logger.middleware")
const WebhookEvent = require("./webhookEvent.model");




exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // 1️⃣ Verify signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error("❌ Webhook signature failed", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info("🔔 Stripe event received: %s", event.type);

  // 2️⃣ Idempotency check
  const alreadyProcessed = await WebhookEvent.findOne({
    eventId: event.id
  });

  if (alreadyProcessed) {
    logger.warn("⚠️ Duplicate webhook ignored: %s", event.id);
    return res.json({ received: true });
  }

  try {
    // 3️⃣ Handle events
    switch (event.type) {

      /* ================================
         CHECKOUT COMPLETED
      ================================== */
      case "checkout.session.completed": {
        const session = event.data.object;

        let orgId = session.metadata?.orgId;

        // Fallback to subscription metadata
        if (!orgId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription
          );
          orgId = sub.metadata?.orgId;
        }

        if (!orgId) {
          logger.warn("⚠️ Missing orgId in checkout.session.completed");
          break;
        }

        await Subscription.findOneAndUpdate(
          { orgId },
          {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            plan: "pro",
            status: "active"
          },
          { upsert: true }
        );

        logger.info("✅ Subscription activated for orgId: %s", orgId);
        break;
      }

      /* ================================
         SUBSCRIPTION UPDATED
      ================================== */
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const orgId = sub.metadata?.orgId;

        if (!orgId) {
          logger.warn("⚠️ Missing orgId in subscription.updated");
          break;
        }

        const status = sub.cancel_at_period_end
          ? "canceling"
          : sub.status;

        await Subscription.findOneAndUpdate(
          { orgId },
          {
            status,
            plan: status === "canceled" ? null : "pro",
            stripeSubscriptionId: sub.id,
            trialEndsAt: sub.trial_end
              ? new Date(sub.trial_end * 1000)
              : null
          }
        );

        logger.info(
          "🔄 Subscription updated for orgId %s → %s",
          orgId,
          status
        );
        break;
      }

      /* ================================
         SUBSCRIPTION DELETED
      ================================== */
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const orgId = sub.metadata?.orgId;

        if (!orgId) {
          logger.warn("⚠️ Missing orgId in subscription.deleted");
          break;
        }

        await Subscription.findOneAndUpdate(
          { orgId },
          {
            status: "canceled",
            plan: null,
            stripeSubscriptionId: sub.id
          }
        );

        logger.info("❌ Subscription canceled for orgId: %s", orgId);
        break;
      }

      /* ================================
         DEFAULT
      ================================== */
      default:
        logger.info("ℹ️ Unhandled Stripe event: %s", event.type);
    }

    // 4️⃣ Save webhook event (idempotency)
    await WebhookEvent.create({
      eventId: event.id,
      type: event.type
    });

    res.json({ received: true });

  } catch (err) {
    logger.error("🔥 Webhook processing error", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

