const milestoneModel = require("../models/milestone.model")
const goalModel = require("../models/goal.model")



async function createMilestoneController(req,res) {
    
    const goalId = req.params.goalId;
    const userId = req.user.id
    const {title , description } = req.body 

    if(!title){
        return res.status(400).json({message : "Title is required for the milestone to create"})
    }
    const goal = await goalModel.findOne({
        _id: goalId,
        userId
    });

    if(!goal){
        return res.status(404).json({
            message: "Goal not found"
        });
    }

    const milestone = await milestoneModel.create({
        title,
        description,
        userId,
        goalId
    })

    res.status(201).json({message: "milestone created successfully",
        milestone:{
            title: milestone.title,
            description : milestone.description,
            completed: milestone.completed
        }
    })

}

async function getAllMilestonesController(req,res) {
    
    const goalId = req.params.goalId;
    const userId = req.user.id

    const milestones = await milestoneModel.find({
        userId,
        goalId
    })

    res.status(200).json({
        message : "All milestone fetched Successfully",
        milestones
    })

}

async function editMilestoneByIdController(req,res) {
    
    const goalId = req.params.goalId;
    const milestoneId =  req.params.milestoneId;
    const userId = req.user.id;
    const { title , description , completed } = req.body
    const update = {}

    if(title !== undefined){
        update.title = title
    }
    if(description !== undefined){
        update.description = description
    }
    if(completed !== undefined){
        update.completed = completed
    }

    const milestone = await milestoneModel.findOneAndUpdate(
        { _id:milestoneId,
            userId,
            goalId },
        update,
        { returnDocument: "after" }
    )

    if(!milestone){
        return res.status(404).json({message: "milestone not found"})
    }

    res.status(200).json({ 
        message:"milestone updated successfully",
        milestone
    })
}

async function deleteMilestoneByIdController(req,res) {
    
    const goalId = req.params.goalId;
    const milestoneId =  req.params.milestoneId;
    const userId = req.user.id;

    const milestone = await milestoneModel.findOneAndDelete(
        { _id:milestoneId,
            userId,
            goalId })
    if(!milestone){
        return res.status(404).json({message: "milestone not found"})
    }

    res.status(200).json({ 
        message:"milestone Deleted successfully"
    })
}


module.exports = { createMilestoneController ,
                 getAllMilestonesController ,
                 editMilestoneByIdController,
                deleteMilestoneByIdController
                }