const express = require("express");
const authRouter = require("../middleware/auth.middleware");
const milestoneController = require("../controllers/milestone.controller")


const milestoneRouter = express.Router();



milestoneRouter.post("/:goalId/milestones" , authRouter.authUser , milestoneController.createMilestoneController )




module.exports = milestoneRouter