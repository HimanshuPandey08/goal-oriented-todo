const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({

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
    milestoneId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Milestones"
    },
    completed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const taskModel = mongoose.model("Tasks" ,taskSchema)

module.exports = taskModel 