const Member = require("./member.model");
const User = require("../../models/User")
const syncSeats = require("../billing/seatSync.service")

// ADMIN only – add member to org
exports.addMember = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { email, role } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const exists = await Member.findOne({
    userId: user._id,
    orgId: req.orgId
  });

  if (exists) {
    return res.status(400).json({ message: "User already in organization" });
  }

  const member = await Member.create({
    userId: user._id,
    orgId: req.orgId,
    role: role || "member"
  });

 // await syncSeats(req.orgId)

  res.status(201).json(member);
};

// ADMIN + MEMBER – list org members
exports.listMembers = async (req, res) => {
  const members = await Member.find({ orgId: req.orgId }).select("userId")
    .populate("userId", "email").lean();

  res.json(members);
};
