const Member = require("../modules/org/member.model");

module.exports = async (req, res, next) => {
  const orgId = req.headers["x-org-id"];
  if (!orgId) return res.status(400).json({ message: "Org ID missing" });

  const member = await Member.findOne({
    userId: req.user.id,
    orgId
  });

  if (!member) {
    return res.status(403).json({ message: "Not a member of this org" });
  }

  req.orgId = orgId;
  req.role = member.role;
  next();
};
