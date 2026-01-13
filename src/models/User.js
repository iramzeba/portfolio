const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role:{
        type:String,
        enum:["admin","member","viewer"],default:"member"
    }
});

userSchema.index({email:1})
module.exports = mongoose.model("User", userSchema);
