const mongoose = require("mongoose");




const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true, "Username is not available"]
    },
    email:{
        type:String,
        required:[true , "Email is required"],
        unique:[true, "Email Already Exists"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
        trim : true ,
        lowercase: true
    },
    password:{
        type:String,
        required:[true, "Pasword is required"],
        minlength:[6, "The password should be minimum with 6 characters"]
    }
},{
    timestamps:true
})


const userModel = mongoose.model("User", userSchema)


module.exports = userModel;