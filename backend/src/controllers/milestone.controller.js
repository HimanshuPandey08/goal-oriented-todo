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


module.exports = { createMilestoneController , getAllMilestonesController }