const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const { sendInvite } = require("./invite.controller");
const { acceptInvite } = require("./invite.accept.controller");

router.post("/", auth, tenant, sendInvite);
router.post("/accept/:token", auth, acceptInvite);

module.exports = router;
