const mongoose = require("mongoose");


const milestoneSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true , "Milestone title is required"],
        trim: true
    },
    description:{
        type:String,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User" ,
        required:true 
    },
    goalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Goals",
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const milestoneModel = mongoose.model("Milestones" ,milestoneSchema)

module.exports = milestoneModel 