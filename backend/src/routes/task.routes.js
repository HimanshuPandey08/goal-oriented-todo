const express = require("express");
const authController = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller")


const taskRotuer = express.Router();


taskRotuer.post("/:goalId/milestones/:milestoneId/tasks" , authController.authUser , taskController.createTaskController)




module.exports = taskRotuer 