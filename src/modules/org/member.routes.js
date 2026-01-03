const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware")
const tenant = require("../../middlewares/tenant.middleware")
const { addMember, listMembers } = require("./member.controller");

router.post("/", auth, tenant, addMember);
router.get("/", auth, tenant, listMembers);

module.exports = router;

