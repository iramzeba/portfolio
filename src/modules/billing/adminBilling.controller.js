const {getUsageStats} = require("./usageStats.service")
const logger = require("../../middlewares/logger.middleware")
exports.getUsageDashboard = async(req,res)=>{
    try{
        const {orgId,from,to} =req.query
        const stats = await getUsageStats({
            orgId,
            from:from && new Date(from),
            to: to && new Date(to)
        });
        res.json({
            success:true,
            data:stats
        }) 

    }catch(err){
    logger.info("Failed to load usage dashboard",err)
    res.json({
        success:false,
        message:"Failed to load usage dashboard"
    })

    }
}