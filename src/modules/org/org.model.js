const mongoose = require("mongoose")
const orgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})


orgSchema.index({owner:1})

module.exports=mongoose.model("Organization",orgSchema)
