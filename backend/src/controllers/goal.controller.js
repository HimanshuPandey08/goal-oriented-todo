
const goalModel = require("../models/goal.model");
const { isGoalIdValid } = require("../utils/ParamValid");

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

    if(!isGoalIdValid(goalId)){
        return res.status(400).json({message: "Invalid Goal id Formate" }); 
    }

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


async function editGoalByIdController(req,res) {
    
    const goalId = req.params.id;
    const userId = req.user.id 

    const { title , description , completed }= req.body

    if(!isGoalIdValid(goalId)){
        return res.status(400).json({message: "Invalid Goal id Formate" });
    }
    
    const update ={}
    if(title !== undefined){
        update.title = title
    }
    if(description !== undefined){
        update.description = description
    }
    if(completed !== undefined){
        update.completed = completed
    }

    const goal = await goalModel.findOneAndUpdate(
        { _id:goalId, userId },
        update,
        {returnDocument: "after"}
    )
    if(!goal){
        return res.status(404).json({message :"Goal not found"})
    }
    res.status(200).json({
        message:"User updated successfully",
        goal
    })

}

async function deleteGoalByIdController(req,res) {
    
    const goalId = req.params.id;
    const userId = req.user.id 

    if(!isGoalIdValid(goalId)){
        return res.status(400).json({message: "Invalid Goal id Formate" });
    }

    const goal = await goalModel.findOneAndDelete({
        _id:goalId,userId
    })

    if(!goal){
        return res.status(404).json({message :"Goal not found"})
    }

    res.status(200).json({message : "Goal deleted successfully"})

}



module.exports = { createGoalController , getAllGoalsController , getGoalByIdController ,editGoalByIdController , deleteGoalByIdController }