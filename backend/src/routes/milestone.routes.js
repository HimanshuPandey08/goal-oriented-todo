const express = require("express");
const authRouter = require("../middleware/auth.middleware");
const milestoneController = require("../controllers/milestone.controller")


const milestoneRouter = express.Router();



milestoneRouter.post("/:goalId/milestones" , authRouter.authUser , milestoneController.createMilestoneController )

milestoneRouter.get("/:goalId/milestones" , authRouter.authUser , milestoneController.getAllMilestonesController )

milestoneRouter.patch("/:goalId/milestones/:milestoneId" , authRouter.authUser , milestoneController.editMilestoneByIdController )

milestoneRouter.delete("/:goalId/milestones/:milestoneId" , authRouter.authUser , milestoneController.deleteMilestoneByIdController )



module.exports = milestoneRouter