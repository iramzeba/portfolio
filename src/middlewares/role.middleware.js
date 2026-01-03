module.exports = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.role)){
            return res.status(403).json({message:"Insufficient permissions" })
        }
        next();
    }
}