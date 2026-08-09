
const goalModel = require("../models/goal.model");
const mongoose = require("mongoose")

async function createGoalController(req,res) {

    const userId = req.user.id ;

    const { title , description } = req.body;
    if(!title){
        return res.status(400).json({message : "Title is required"})
    }
    const goal = await goalModel.create({
        title, description , userId
    })

    res.status(201).json({
        message : "Goal created successfully",
        goal:{
            title: goal.title,
            description:goal.description,
            userId: goal.userId,
            completed: goal.completed
        }
    })
}

async function getAllGoalsController(req,res) {
    
    const userId = req.user.id;

    const goals = await goalModel.find({userId});
    
    res.status(200).json({
        message: "Goals Fectched successfully",
        goals
    })
}


async function getGoalByIdController(req,res) {
    
    const goalId = req.params.id;
    const userId = req.user.id 

    if(!mongoose.Types.ObjectId.isValid(goalId)){
        return res.status(400).json({message: "Invalid Goal id Formate" });    }
    const goal = await goalModel.findOne({
        _id:goalId,
        userId
    })

    if(!goal){
        return res.status(404).json({message: "Goal not found"})
    }
    res.status(200).json({
        message:"Goal Found successfully",
        goal
    })

}



module.exports = { createGoalController , getAllGoalsController , getGoalByIdController }