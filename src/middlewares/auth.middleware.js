const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
   

    try{
      
        const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        message:"Authorization token missing"
      })
    }
   
      const token = authHeader.split(" ")[1];
 
      const payload = jwt.verify(token, process.env.JWT_SECERET)
            console.log(payload,'authHeader')
       if (payload.type !== "access") {
      return res.status(403).json({ message: "Invalid access token" });
    }
     
      req.user ={
        id: payload.userId, 
         orgId: payload.orgId
       // email:decode.email
      
        }
 

  
console.log("User ID:", req.user.id);

        next();

    }catch(err){
       
     return res.status(401).json({
        message:"Invalid or expired token"
     })
    }
}