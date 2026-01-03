const router = require("express").Router()
const auth = require("../../middlewares/auth.middleware")
const tenant = require("../../middlewares/tenant.middleware")
const requirePlan = require('../../middlewares/plan.middleware')
const { createProject,getProject,deleteProject} = require('./project.controller')
const cache = require("../../middlewares/cache")
const role = require("../../middlewares/role.middleware")
const usageLimit = require("../../middlewares/usageLimit.middleware")
const Project = require('./project.model')


router.post("/",auth,tenant, requirePlan("pro"),role("admin","member"), 
usageLimit("projects",Project),
createProject)


router.get("/",auth,tenant,
cache(120),//2min
getProject)
router.delete("/:id",auth,tenant,deleteProject)

module.exports = router;