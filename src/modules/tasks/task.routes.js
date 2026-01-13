const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask
} = require("./task.controller");

const cache = require("../../middlewares/cache")

router.post("/", auth, tenant, createTask);
router.get("/:projectId", auth, tenant,cache(120), getTasks);
router.patch("/:id/status", auth, tenant, updateTaskStatus);
router.delete("/:id", auth, tenant, deleteTask);

module.exports = router;
