const express = require("express");
const cookieParser = require("cookie-parser")


const authRouter = require("./routes/auth.routes")
const goalRouter = require("./routes/goal.routes")
const milestoneRouter = require("./routes/milestone.routes")
const taskRouter = require("./routes/task.routes")

const app = express();



app.use(express.json())
app.use(cookieParser())




app.use("/api/auth", authRouter)
app.use("/api/goals",goalRouter )
app.use("/api/goals", milestoneRouter)
app.use("/api/goals", taskRouter)


module.exports = app