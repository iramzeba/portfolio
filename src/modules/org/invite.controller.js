const crypto = require("crypto");
const Invite = require("./invite.model");
const Member = require("./member.model");
const logger  = require("../../middlewares/logger.middleware")


// ADMIN only
exports.sendInvite = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const { email, role } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const invite = await Invite.create({
    email,
    orgId: req.orgId,
    role: role || "member",
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hrs
  });



  // 🚀 In real app → send email
  res.json({
    message: "Invite created",
    inviteLink: `${process.env.BASE_URL}/invites/accept/${token}`
  });
};
