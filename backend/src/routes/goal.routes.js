const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const goalController = require("../controllers/goal.controller")

const goalRouter = express.Router();



goalRouter.post("/" , authMiddleware.authUser, goalController.createGoalController  )






module.exports = goalRouter;