const subscription = require("../modules/billing/subscription.model")
const planLimits = require("../config/planLimits")

module.exports = (resource,Model)=>{
    return async (req,res,next)=>{
        const sub = await subscription.findOne({orgId:req.orgId})
        const plan = sub?.plan || "free"
        const limit = planLimits[plan][resource];
        if(limit == Infinity) return next();
        
        const count = await Model.countDocuments({orgId:req.orgId})

        if(count >=limit){
            return res.status(403).json({messgae:`Limit reached for ${resource}. Upgrade your plan.`})
        }
        next();
    }
}