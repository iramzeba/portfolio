const express = require("express");
const router = express.Router();
const { webhook } = require("./webhook.controller");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

module.exports = router;
