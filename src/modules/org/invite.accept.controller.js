const Invite = require("./invite.model");
const Member = require("./member.model");

exports.acceptInvite = async (req, res) => {
  const { token } = req.params;

  const invite = await Invite.findOne({
    token,
    accepted: false,
    expiresAt: { $gt: new Date() }
  }).lean();

  if (!invite) {
    return res.status(400).json({ message: "Invalid or expired invite" });
  }

  await Member.create({
    userId: req.user.id,
    orgId: invite.orgId,
    role: invite.role
  });

  invite.accepted = true;
  await invite.save();

  res.json({ message: "Joined organization successfully" });
};

