const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  accepted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Invite", inviteSchema);
