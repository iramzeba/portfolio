const jwt = require("jsonwebtoken")
exports.signAccessToken = (payload)=>
    jwt.sign(payload,process.env.JWT_SECERET,{
        expiresIn:"19h"
        
    })

    exports.signRefreshToken = (payload)=>
    jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:"19h"
    })
    
    exports.verifyAccessToken = (token)=>
    jwt.verify(token,process.env.JWT_SECERET);

    exports.verifyRefreshToken = (token)=>
    jwt.verify(token,process.env.JWT_REFRESH_SECRET)

    