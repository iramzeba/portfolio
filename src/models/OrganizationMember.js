const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  role: { type: String, enum: ["OWNER", "ADMIN", "MEMBER"], default: "MEMBER" },
});

memberSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

module.exports = mongoose.model("OrganizationMember", memberSchema);
