
const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    resource: String,
    resourceId: mongoose.Schema.Types.ObjectId,
    meta: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
