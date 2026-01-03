const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema({
name:{
    type:String,
    require:true
},
description:{
    type:String
},
orgId:{
    type:mongoose.Schema.ObjectId,
    ref:"Organization",
    required:true,
    index:true
},
createdBy:{
     type:mongoose.Schema.ObjectId,
     ref:"User"
}
},{timestamp:true})

projectSchema.index({orgId:1})
module.exports = mongoose.model("Project", projectSchema);