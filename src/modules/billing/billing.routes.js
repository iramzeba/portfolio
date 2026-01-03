const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const { createCheckoutSession,successPage,CancelPage,createBillingPortalSession,reportUsage } = require("./billing.controller");
const {getUsageDashboard} = require("./adminBilling.controller")

router.post("/checkout", auth, tenant, createCheckoutSession);
router.get("/success", successPage)
router.get("/cancel", CancelPage)
router.post("/billingportal",auth, tenant,createBillingPortalSession)

router.post(
  "/usage/report",
  auth,
  tenant,
  reportUsage
);

router.get("/admin/usage",
auth,
tenant,
getUsageDashboard
)

module.exports = router;
