const Organization = require('./org.model');
const Member = require('./member.model')
const jwt = require("jsonwebtoken")

exports.createOrg = async(req,res)=>{
    try{
    const {name} = req.body;
    console.log(req,'req')
    const org = await Organization.create({
        name,owner:req.user.id
    });
    await Member.create({
        userId:req.user.id,orgId:org._id,role:"admin"
    })
    res.status(201).json(org);

    }catch(err){
     res.status(500).json({message:err.message})
    }
}

exports.listOrgs = async (req,res)=>{
    try{
       const memberShip = await Member.find({userId:req.user.id}).populate("orgId")
       const orgs = memberShip.map(m=>m.orgId);

     

       res.json(orgs)
    }catch(err){
      res.status(500).json({
        message:err.message
      })
    }
}