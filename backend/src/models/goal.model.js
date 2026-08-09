const mongoose = require("mongoose");


const goalSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true , "title is required"],
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
    completed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})



const goalModel = mongoose.model("Goals", goalSchema);

module.exports = goalModel;