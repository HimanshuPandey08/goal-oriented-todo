const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const goalController = require("../controllers/goal.controller")

const goalRouter = express.Router();



goalRouter.post("/" , authMiddleware.authUser, goalController.createGoalController  )

goalRouter.get("/" , authMiddleware.authUser, goalController.getAllGoalsController  )

goalRouter.get("/:id" , authMiddleware.authUser, goalController.getGoalByIdController  )






module.exports = goalRouter;