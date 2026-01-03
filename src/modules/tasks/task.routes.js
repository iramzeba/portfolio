const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask
} = require("./task.controller");

router.post("/", auth, tenant, createTask);
router.get("/:projectId", auth, tenant, getTasks);
router.patch("/:id/status", auth, tenant, updateTaskStatus);
router.delete("/:id", auth, tenant, deleteTask);

module.exports = router;
