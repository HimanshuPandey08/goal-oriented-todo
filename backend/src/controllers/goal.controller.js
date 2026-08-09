const goalModel = require("../models/goal.model");


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


module.exports = { createGoalController  }