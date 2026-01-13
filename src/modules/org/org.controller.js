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
      const orgs = await Member.aggregate([
        {$match:{userId:req.user.id}},
        {
          $lookup:{
            from:'organizations',
            localField:'orgId',
            foreignField:'_id',
            as :'org'
          }
        },{
              $unwind:'$org'
        },
        {
          $project:{
            _id:'$org._id',
            name:'$org.name'

          }
        }

      ]).allowDiskUse(true);
       res.json(orgs)
    }catch(err){
      res.status(500).json({
        message:err.message
      })
    }
}