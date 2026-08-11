const milestoneModel = require("../models/milestone.model");
const taskModel = require("../models/task.model")



async function createTaskController(req,res) {
    
    const userId = req.user.id;
    const goalId = req.params.goalId;
    const milestoneId = req.params.milestoneId

    const { title , description} = req.body
    if(!title){
        return res.status(400).json({message : "Task title is required "})
    }

    const milestone = await milestoneModel.findOne({
        _id:milestoneId,
        userId,
        goalId
    })
    if(!milestone){
        return res.status(404).json({message : "Milestone not found"})
    }

    const task = await taskModel.create({
        title,
        description,
        userId,
        goalId,
        milestoneId
    })

    res.status(201).json({
        message : "Task created successfully",
        task:{
            title:task.title,
            description:task.description,
            completed:task.completed
        }
    })

}

async function getAllTasksController(req,res) {
    
    const userId = req.user.id
    const goalId = req.params.goalId
    const milestoneId = req.params.milestoneId

    const tasks = await taskModel.find({ userId , goalId , milestoneId })
    
    res.status(200).json({
        message:"All the task created by user",
        tasks
    })
}

async function editTaskByIdController(req,res) {
    
    const userId = req.user.id
    const goalId= req.params.goalId
    const milestoneId = req.params.milestoneId
    const taskId = req.params.taskId 

    const { title , description , completed } = req.body

    const update ={}
    if(title !== undefined){
        update.title = title
    }
    if(description !== undefined ){
        update.description = description
    }
    if(completed !== undefined){
        update.completed = completed
    }

    const task = await taskModel.findOneAndUpdate({
        _id:taskId, userId, goalId,milestoneId },
        update,
        { returnDocument:"after" }
    )
    if(!task){
        return res.status(404).json({message: "Task not found"})
    }

    res.status(200).json({
        message:"Task updated successfully",
        task
    })
}

async function deleteTaskByIdController(req,res) {
    
    const userId = req.user.id 
    const goalId = req.params.goalId
    const milestoneId = req.params.milestoneId 
    const taskId = req.params.taskId

    const task = await taskModel.findOneAndDelete({
        _id:taskId,
        userId, goalId , milestoneId
    })
    if(!task){
        return res.status(404).json({message : "Task not found"})
    }
    res.status(200).json({message : "Task deleted successfully"})
}



module.exports = { createTaskController ,
                    getAllTasksController,
                    editTaskByIdController,
                    deleteTaskByIdController }