const express = require("express");
const authController = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller")


const taskRotuer = express.Router();


taskRotuer.post("/:goalId/milestones/:milestoneId/tasks" , authController.authUser , taskController.createTaskController)

taskRotuer.get("/:goalId/milestones/:milestoneId/tasks" , authController.authUser , taskController.getAllTasksController)

taskRotuer.patch("/:goalId/milestones/:milestoneId/tasks/:taskId" , authController.authUser , taskController.editTaskByIdController)

taskRotuer.delete("/:goalId/milestones/:milestoneId/tasks/:taskId" , authController.authUser , taskController.deleteTaskByIdController)




module.exports = taskRotuer 