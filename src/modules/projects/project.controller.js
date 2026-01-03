const Project = require('./project.model.js')
const logAudit = require("../../utils/auditLogger");


exports.createProject = async(req,res)=>{
    if(req.role!="admin"){
        return res.status(403).json({
            message:"admin access required"
        })
    }

    const project = await Project.create({
    name:req.body.name,
    description:req.body.description,
    orgId:req.orgId,
    createdBy:req.user.id
    })

await logAudit({
    req,
    action:"CREATE_PROJECT",
    resource:"PROJECT",
    resourceId:project._id
})
    
    res.status(201).json(project)
}

exports.getProject = async(req,res)=>{
    console.log(req.user,'ree')
const projects = await Project.find({orgId:req.orgId})
res.json(projects)

}

exports.deleteProject = async(req,res)=>{
    if(req.role!="admin"){
     res.status(403).json({message:"Admin access required"})
    }
    await Project.deleteOne({
        _id:req.params.id,
        orgId:req.orgId
    })
    res.json({message:"project deleted"})
}