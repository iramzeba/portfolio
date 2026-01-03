// utils/auditLogger.js
const AuditLog = require("../modules/audit/audit.model");

module.exports = async ({
  req,
  action,
  resource,
  resourceId,
  meta = {}
}) => {
  if (!req.orgId || !req.user) return;

  await AuditLog.create({
    orgId: req.orgId,
    userId: req.user.id,
    action,
    resource,
    resourceId,
    meta
  });
};
