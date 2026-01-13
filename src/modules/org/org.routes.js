const router =  require("express").Router()
const {createOrg,listOrgs} = require('./org.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const rateLimit = require("../../middlewares/rateLimit")
const cache = require("../../middlewares/cache")


router.post("/",authMiddleware, createOrg)


 router.get(
  "/",
  authMiddleware,   // decode token, no DB
  cache(120),      // user-scoped
rateLimit({ windowSeconds: 60, maxRequests: 10 }),
  listOrgs
);


module.exports = router;