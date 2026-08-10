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



module.exports = { createTaskController }