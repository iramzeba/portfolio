const express = require("express");
const controller = require("./auth.controller");
const { refreshTokenMiddleware } = require("./verifyToken")
const router = express.Router();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout",controller.logout)
router.post("/refresh",refreshTokenMiddleware)
module.exports = router;
