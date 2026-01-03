const mongoose = require("mongoose")
const memberSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,ref:'User',required:true
    },
    orgId:{
     type:mongoose.Schema.ObjectId,ref:'Organization',required:true
    },
    role:{
        type:String,
        enum:["admin","member","viewer"],default:"member"
    }
},{timestamp:true})


memberSchema.index({orgId:1,userId:1})

module.exports = mongoose.model("Member",memberSchema) 